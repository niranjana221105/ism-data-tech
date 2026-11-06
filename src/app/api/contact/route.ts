import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  country: z.string().min(2),
  service: z.string().min(1),
  requirements: z.string().min(20),
  timeline: z.string().optional(),
  consent: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Send email via nodemailer if SMTP is configured
    // If not configured, submissions are logged (add your email provider here)
    const smtpConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    if (smtpConfigured) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"ISM Website" <${process.env.SMTP_USER}>`,
        to: "official@ismdatatech.com",
        replyTo: data.email,
        subject: `New Business Enquiry from ${data.name} – ${data.service}`,
        html: `
          <h2>New Business Enquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Company:</strong> ${data.company ?? "Not provided"}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>Service:</strong> ${data.service}</p>
          <p><strong>Timeline:</strong> ${data.timeline ?? "Not specified"}</p>
          <hr />
          <p><strong>Requirements:</strong></p>
          <p>${data.requirements.replace(/\n/g, "<br/>")}</p>
          <hr />
          <p style="color:#888;font-size:12px">Submitted via ismdatatech.com contact form</p>
        `,
      });
    } else {
      // Log submission for development (SMTP not configured)
      console.log("[Contact Form Submission]", {
        name: data.name,
        email: data.email,
        service: data.service,
        country: data.country,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
