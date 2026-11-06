"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, item, fadeUp, fadeLeft, fadeRight, vp } from "@/lib/motion";
import { SERVICES, ADDITIONAL_SERVICES, SERVICE_CATEGORIES } from "@/lib/data";
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, ChevronRight } from "lucide-react";

const INITIAL_SHOW = 4; // programs visible before "View More"

/* ─── Trending feature data ──────────────────────── */
const TRENDING = [
  {
    id: "ai-projects",
    title: "AI Projects",
    subtitle: "Trending",
    badge: "High Demand",
    badgeColor: "#86adf5",
    desc: "ISM Data Technology delivers high-quality AI training data solutions — including data collection, labelling, classification and annotation services that power machine learning models for global technology companies.",
    capabilities: [
      "Image & text data labelling",
      "Data classification & tagging",
      "Named entity recognition",
      "Sentiment annotation",
      "Quality-controlled AI datasets",
    ],
    gradient: "linear-gradient(135deg, rgba(0,85,255,0.08) 0%, rgba(45,70,94,0.04) 100%)",
    border: "rgba(0,85,255,0.18)",
    accent: "#0055ff",
  },
  {
    id: "video-annotation",
    title: "Video Annotation",
    subtitle: "Trending",
    badge: "Fast Growing",
    badgeColor: "#2d465e",
    desc: "ISM provides professional video annotation services for computer vision and autonomous systems. Frame-by-frame annotation, object tracking and bounding box labelling services delivered at scale with accuracy and speed.",
    capabilities: [
      "Frame-by-frame object labelling",
      "Bounding box annotation",
      "Object tracking across frames",
      "Semantic segmentation",
      "Action & event classification",
    ],
    gradient: "linear-gradient(135deg, rgba(45,70,94,0.08) 0%, rgba(0,85,255,0.05) 100%)",
    border: "rgba(45,70,94,0.16)",
    accent: "#2d465e",
  },
];

/* ─── SVG stroke icon ────────────────────────────── */
const ServiceGradient = ({ id, c1, c2 }: { id:string; c1:string; c2:string }) => (
  <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={c1}/><stop offset="1" stopColor={c2}/></linearGradient></defs>
);

const ServiceIcon = ({ type, size = 22 }: { type: string; size?: number }): React.ReactElement => {
  const s = size;
  const map: Record<string, React.ReactElement> = {
    BookOpen:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si1" c1="#0055ff" c2="#0055ff"/><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Phone:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si2" c1="#8ca4bc" c2="#0055ff"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    CreditCard: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si3" c1="#0055ff" c2="#0055ff"/><rect width="22" height="16" x="1" y="4" rx="2"/><line x1="1" x2="23" y1="10" y2="10"/></svg>,
    HeartPulse: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si4" c1="#0055ff" c2="#8ca4bc"/><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-2 2 4.5 1.5-2.5H21"/></svg>,
    Languages:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si5" c1="#8ca4bc" c2="#0055ff"/><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>,
    FileCheck:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si6" c1="#0055ff" c2="#0055ff"/><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>,
    Database:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si7" c1="#0055ff" c2="#0055ff"/><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>,
    Archive:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si8" c1="#8ca4bc" c2="#0055ff"/><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>,
    ScrollText: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si9" c1="#0055ff" c2="#8ca4bc"/><path d="M8 21h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
    FileText:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si10)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si10" c1="#0055ff" c2="#8ca4bc"/><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
    Newspaper:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si11)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si11" c1="#8ca4bc" c2="#0055ff"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
    BookMarked: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si12)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si12" c1="#0055ff" c2="#0055ff"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><polyline points="10 2 10 10 13 7 16 10 16 2"/></svg>,
    Target:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si13)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si13" c1="#0055ff" c2="#0055ff"/><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    Receipt:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si14)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si14" c1="#8ca4bc" c2="#0055ff"/><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>,
    FileStack:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si15)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si15" c1="#0055ff" c2="#8ca4bc"/><path d="M21 7h-3a2 2 0 0 1-2-2V2"/><path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z"/><path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15"/><path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11"/></svg>,
    Globe:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si16)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si16" c1="#0055ff" c2="#8ca4bc"/><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    Code2:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si17)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si17" c1="#0055ff" c2="#0055ff"/><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>,
    Keyboard:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#si18)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ServiceGradient id="si18" c1="#8ca4bc" c2="#0055ff"/><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>,
  };
  return map[type] ?? (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="url(#sidef)" strokeWidth="1.8">
      <defs><linearGradient id="sidef" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0055ff"/><stop offset="1" stopColor="#0055ff"/></linearGradient></defs>
      <circle cx="12" cy="12" r="9"/>
    </svg>
  );
};

/* ─── Additional service SVG illustrations ───────── */
/* ─── Main component ─────────────────────────────── */
export default function Services() {
  const [expanded, setExpanded] = useState<string|null>(null);
  const [showAll,  setShowAll]  = useState(false);

  const visibleServices = showAll ? SERVICES : SERVICES.slice(0, INITIAL_SHOW);

  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background:"var(--d1)" }}>
      <div className="absolute inset-0 fine-grid opacity-60 pointer-events-none"/>
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background:"radial-gradient(circle,rgba(0,85,255,0.08) 0%,transparent 70%)", transform:"translate(20%,-20%)" }}/>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-5">Our Expertise</div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)", lineHeight:1.06 }}>
              Precision in<br /><span className="tg-main">Every Project</span>
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
            style={{ color:"var(--text2)", lineHeight:1.8, fontSize:17 }}>
            16 specialised service types including trending AI and video annotation services — accuracy, reliability and global delivery standards on every engagement.
          </motion.p>
        </div>

        {/* ── TRENDING SERVICES — prominently featured first ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
          className="flex items-center gap-3 mb-6">
          <span className="eyebrow" style={{ color:"var(--cyan)" }}>
            <span className="inline-block w-5 h-0.5 rounded-full mr-2" style={{ background:"var(--cyan)" }}/>
            Trending Services
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:"rgba(0,85,255,0.12)", color:"var(--cyan)", border:"1px solid rgba(0,85,255,0.25)" }}>
            <Sparkles size={11}/> High Demand
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {TRENDING.map((tr, i) => (
            <motion.div key={tr.id}
              variants={i===0 ? fadeLeft : fadeRight}
              initial="hidden" whileInView="show" viewport={vp}
              className="rounded-3xl overflow-hidden group"
              style={{ background:tr.gradient, border:`1px solid ${tr.border}` }}
              whileHover={{ y:-6, boxShadow:`0 28px 72px rgba(0,85,255,0.22)` }}>
              <div className="p-7 sm:p-8">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
                  style={{ background:`${tr.accent}18`, color:tr.accent, border:`1px solid ${tr.accent}40` }}>
                  {tr.badge}
                </span>
                <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:22, color:"var(--ism-slate)", marginBottom:10, lineHeight:1.2 }}>
                  {tr.title}
                </h3>
                <p style={{ color:"var(--text2)", fontSize:16, lineHeight:1.78, marginBottom:18 }}>
                  {tr.desc}
                </p>
                {/* Capabilities */}
                <div className="grid grid-cols-1 gap-2 mb-7">
                  {tr.capabilities.map((cap, j) => (
                <div key={j} className="flex items-center gap-3 text-[15px]" style={{ color:"var(--text2)" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:tr.accent }}/>
                      {cap}
                    </div>
                  ))}
                </div>
                <a href="/contact#quote"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all"
                  style={{ background:`${tr.accent}20`, border:`1px solid ${tr.accent}40`, color:tr.accent }}
                  onMouseEnter={e => { (e.currentTarget).style.background=`${tr.accent}35`; }}
                  onMouseLeave={e => { (e.currentTarget).style.background=`${tr.accent}20`; }}>
                  Explore Service <ArrowRight size={14}/>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── EXPLORE ALL PROGRAMS — all 14 main services + 4 additional programs ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background:"linear-gradient(160deg,var(--d0),var(--d3))", border:"1px solid rgba(0,85,255,0.18)" }}>
          <div className="p-6 sm:p-10 lg:p-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="mb-10">
              <div className="eyebrow mb-4">Complete Portfolio</div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <h3 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", color:"var(--ism-slate)" }}>
                  Explore All <span className="tg-main">Programs</span>
                </h3>
                <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.75, maxWidth:440 }}>
                  Every programme we offer — from historical records and healthcare data to voice support, business leads and more.
                </p>
              </div>
            </motion.div>

            {/* 14 main SERVICES — show first 4, expand on demand */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2"
              style={{ perspective:1200 }}>
              <AnimatePresence initial={false}>
                {visibleServices.map((svc) => {
                  const open = expanded === svc.id;
                  return (
                    <motion.div key={svc.id}
                      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                      transition={{ duration:0.4, ease:"easeOut" }}
                      layout
                      className="card-glow overflow-hidden"
                      style={{ willChange:"transform", transformStyle:"preserve-3d" }}
                      whileHover={{ y:-6, rotateX:1, rotateY:-1, boxShadow:"0 24px 56px rgba(1,35,103,0.24)" }}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <motion.div whileHover={{ scale:1.08, rotate:-4 }} transition={{ duration:0.25 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background:"rgba(0,85,255,0.12)", border:"1px solid rgba(0,85,255,0.22)" }}>
                            <ServiceIcon type={svc.icon} size={19}/>
                          </motion.div>
                          <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", padding:"3px 9px", borderRadius:9999, background:"rgba(0,85,255,0.08)", color:"var(--ism-navy)", border:"1px solid rgba(1,35,103,0.16)" }}>
                            {SERVICE_CATEGORIES.find(c=>c.value===svc.category)?.label.split(" ")[0]}
                          </span>
                        </div>
                        <div className="h-0.5 w-6 rounded-full mb-3" style={{ background:"linear-gradient(90deg,#012367,#0055ff)" }}/>
                        <h4 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:16, color:"var(--ism-slate)", lineHeight:1.4, marginBottom:8 }}>{svc.title}</h4>
                        <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{svc.description}</p>
                      </div>
                      <button onClick={()=>setExpanded(open?null:svc.id)}
                        className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold cursor-pointer transition-colors"
                        style={{ fontFamily:"var(--font-sans)", borderTop:"1px solid rgba(1,35,103,0.10)", background:"none", color:open?"var(--cyan)":"var(--text2)" }}>
                        {open?"Hide":"Details"}
                        {open?<ChevronUp size={15}/>:<ChevronDown size={15}/>}
                      </button>
                      <AnimatePresence>
                        {open&&(
                          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                            exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }} className="overflow-hidden">
                            <div className="px-5 pb-4 pt-3" style={{ borderTop:"1px solid rgba(1,35,103,0.10)" }}>
                              <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.75 }}>{svc.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* View More / View Less button */}
            <div className="flex justify-center mt-6 mb-8">
              <motion.button
                onClick={() => { setShowAll(v => !v); if (showAll) setExpanded(null); }}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: showAll ? "rgba(1,35,103,0.05)" : "rgba(0,85,255,0.08)",
                  border: `1px solid ${showAll ? "rgba(1,35,103,0.14)" : "rgba(0,85,255,0.25)"}`,
                  color: showAll ? "var(--text2)" : "var(--cyan)",
                  fontFamily:"var(--font-sans)",
                }}>
                {showAll ? (
                  <><ChevronUp size={15}/> View Less Programs</>
                ) : (
                  <><ChevronRight size={15}/> View More Programs <span style={{ fontSize:13, opacity:0.8 }}>({SERVICES.length - INITIAL_SHOW} more)</span></>
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="h-px mb-8" style={{ background:"linear-gradient(90deg,transparent,rgba(0,85,255,0.3),transparent)" }}/>

            {/* 4 additional services */}
            <p className="eyebrow mb-6" style={{ color:"var(--ism-slate)", fontSize:12 }}>
              <span className="inline-block w-4 h-0.5 rounded-full mr-2" style={{ background:"rgba(45,70,94,0.4)" }}/>
              Additional Services
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ADDITIONAL_SERVICES.map(s => (
                <motion.div key={s.id} variants={item}
                  className="card-glow overflow-hidden"
                  whileHover={{ y:-7, boxShadow:"0 24px 64px rgba(0,85,255,0.2)" }}>
                  <div className="p-5">
                    <div className="h-0.5 w-7 rounded-full mb-3" style={{ background:"linear-gradient(90deg,#012367,#0055ff)" }}/>
                    <h4 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:15, color:"var(--ism-slate)", marginBottom:8 }}>{s.title}</h4>
                    <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72 }}>{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
