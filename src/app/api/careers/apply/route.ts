import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { Resend } from "resend";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_BASE64_LENGTH = Math.ceil(MAX_FILE_BYTES / 3) * 4 + 128;
const schema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  location: z.string().trim().min(2).max(160),
  experience: z.string().trim().min(1).max(120),
  education: z.string().trim().min(2).max(160),
  skills: z.string().trim().min(10).max(5000),
  linkedin: z.string().trim().max(500).optional().default(""),
  portfolio: z.string().trim().max(500).optional().default(""),
  coverLetter: z.string().trim().max(10000).optional().default(""),
  consent: z.literal(true),
  resumeData: z.string().min(1).max(MAX_BASE64_LENGTH),
  resumeName: z.string().trim().min(1).max(180),
}).strict();

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
  }

  let uploadedKey: string | null = null;
  let supabase: ReturnType<typeof createAdminSupabaseClient> | null = null;
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid application form data." }, { status: 400 });
    }

    const data = parsed.data;
    const dataUrl = /^data:[^;,]+;base64,([A-Za-z0-9+/]+={0,2})$/.exec(data.resumeData);
    if (!dataUrl) {
      return NextResponse.json({ error: "Invalid resume file." }, { status: 400 });
    }
    const base64 = dataUrl[1];
    if (base64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json({ error: "Resume must be 5 MB or smaller." }, { status: 413 });
    }
    const fileContent = Buffer.from(base64, "base64");
    if (
      fileContent.length === 0 ||
      fileContent.length > MAX_FILE_BYTES ||
      fileContent.toString("base64") !== base64
    ) {
      return NextResponse.json({ error: "Resume must be a valid file no larger than 5 MB." }, { status: 400 });
    }

    const detectedType = await fileTypeFromBuffer(fileContent);
    let contentType = detectedType?.mime;
    let extension = detectedType?.ext;
    if (
      detectedType?.mime === "application/x-cfb" &&
      /\.doc$/i.test(data.resumeName) &&
      fileContent.subarray(0, 8).equals(
        Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
      )
    ) {
      contentType = "application/msword";
      extension = "doc";
    }
    if (
      !contentType ||
      !extension ||
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(contentType)
    ) {
      return NextResponse.json({ error: "Only valid PDF, DOC or DOCX resumes are accepted." }, { status: 400 });
    }
    supabase = createAdminSupabaseClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, state, deadline")
      .eq("id", data.jobId)
      .maybeSingle();
    if (jobError) {
      console.error("Career application job lookup failed:", jobError.code);
      return NextResponse.json({ error: "Unable to submit your application right now." }, { status: 503 });
    }
    if (!job || job.state !== "published" || (job.deadline && job.deadline < today)) {
      return NextResponse.json({ error: "This position is no longer accepting applications." }, { status: 400 });
    }

    const safeFileName = data.resumeName.replace(/[\r\n"\\/]/g, "_").slice(0, 180);
    uploadedKey = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("career-resumes")
      .upload(uploadedKey, fileContent, { contentType, upsert: false });
    if (uploadError) {
      console.error("Career resume upload failed:", uploadError.message);
      uploadedKey = null;
      return NextResponse.json({ error: "Unable to store your resume. Please try again." }, { status: 503 });
    }

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        job_id: job.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        linkedin_url: data.linkedin || null,
        portfolio_url: data.portfolio || null,
        cover_letter: data.coverLetter || null,
        consent: data.consent,
        resume_storage_key: uploadedKey,
        resume_original_name: safeFileName,
        resume_content_type: contentType,
        resume_size_bytes: fileContent.length,
      })
      .select("id")
      .single();

    if (insertError || !application) {
      console.error("Career application insert failed:", {
        code: insertError?.code,
        message: insertError?.message,
        details: insertError?.details,
        hint: insertError?.hint,
      });
      const { error: cleanupError } = await supabase.storage
        .from("career-resumes")
        .remove([uploadedKey]);
      if (cleanupError) {
        console.error("Orphan resume cleanup failed:", cleanupError.message);
      }
      uploadedKey = null;
      return NextResponse.json({ error: "Unable to submit your application right now." }, { status: 503 });
    }
    uploadedKey = null;

    console.info("Application saved successfully.");
    await sendApplicationNotification(
      data,
      job.title,
      safeFileName,
      application.id,
    );
    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    console.error(
      "Career application submission failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    if (uploadedKey && supabase) {
      const { error: cleanupError } = await supabase.storage
        .from("career-resumes")
        .remove([uploadedKey]);
      if (cleanupError) {
        console.error("Orphan resume cleanup failed:", cleanupError.message);
      }
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid application form data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to submit your application right now." }, { status: 503 });
  }
}

async function sendApplicationNotification(
  data: z.infer<typeof schema>,
  position: string,
  fileName: string,
  applicationId: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !recipient) {
    console.error(
      "Application saved successfully, but notification email failed. Resend configuration is incomplete.",
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const subjectPosition = position.replace(/[\r\n]/g, " ").slice(0, 160);
    const subjectName = data.fullName.replace(/[\r\n]/g, " ").slice(0, 160);
    const applicationDate = new Date().toISOString();
    const { data: sentEmail, error } = await resend.emails.send(
      {
        from: "ISM Careers <onboarding@resend.dev>",
        to: recipient,
        replyTo: data.email,
        subject: `New Job Application - ${subjectPosition} - ${subjectName}`,
        html: [
          "<h2>New Job Application</h2>",
          `<p><strong>Candidate Name:</strong> ${escapeHtml(data.fullName)}</p>`,
          `<p><strong>Candidate Email:</strong> ${escapeHtml(data.email)}</p>`,
          `<p><strong>Phone Number:</strong> ${escapeHtml(data.phone)}</p>`,
          `<p><strong>Applied Position:</strong> ${escapeHtml(position)}</p>`,
          `<p><strong>Location:</strong> ${escapeHtml(data.location)}</p>`,
          `<p><strong>Experience:</strong> ${escapeHtml(data.experience)}</p>`,
          `<p><strong>Application Date:</strong> ${escapeHtml(applicationDate)}</p>`,
          `<p><strong>Resume File Name:</strong> ${escapeHtml(fileName)}</p>`,
          `<p><strong>Application ID:</strong> ${escapeHtml(applicationId)}</p>`,
          "<hr/><p>Please review the full application from the ISM Admin Portal.</p>",
        ].join(""),
      },
      { idempotencyKey: `career-application-${applicationId}` },
    );

    if (error) {
      console.error(
        "Application saved successfully, but Resend rejected the notification.",
        {
          name: error.name,
          statusCode: error.statusCode,
          message: error.message,
        },
      );
      return;
    }

    if (!sentEmail) {
      console.error(
        "Application saved successfully, but Resend returned no notification result.",
      );
      return;
    }

    console.info("Application notification accepted by Resend.", {
      emailId: sentEmail.id,
    });
  } catch (error) {
    console.error(
      "Application saved successfully, but Resend notification failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}
