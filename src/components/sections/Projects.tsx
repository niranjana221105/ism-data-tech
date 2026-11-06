"use client";
import { motion } from "framer-motion";
import { stagger, item, fadeUp, fadeLeft, vp } from "@/lib/motion";

const PROJECTS = [
  { title:"USA Tax Filing Voice Support",     cat:"IT & Voice",    desc:"Voice-based tax assistance for UK and US clients with professional accuracy.",       col:"#0055ff",     bg:"rgba(0,85,255,0.08)" },
  { title:"Healthcare Records Management",    cat:"IT & Voice",    desc:"Sensitive healthcare data managed with strict confidentiality and accuracy.",          col:"#2d465e",     bg:"rgba(0,85,255,0.08)" },
  { title:"Historical Baptism Records Index", cat:"Historical",    desc:"Thousands of handwritten documents transcribed and indexed for preservation.",         col:"#2d465e",      bg:"rgba(140,164,188,0.08)" },
  { title:"USA Vital Records Processing",     cat:"Historical",    desc:"Birth, death and marriage certificates processed per US government standards.",        col:"#0055ff",     bg:"rgba(0,85,255,0.08)" },
  { title:"Australian Business Leads",        cat:"Biz Support",   desc:"Verified B2B contact datasets enabling faster Australian market entry.",              col:"#2d465e",     bg:"rgba(0,85,255,0.08)" },
  { title:"Newspaper Zoning & Indexing",      cat:"Content",       desc:"Archive classification enabling fast digital content discovery for research.",         col:"#2d465e",      bg:"rgba(140,164,188,0.08)" },
  { title:"Filipino Civil Registry Entry",    cat:"Data Entry",    desc:"Accurate civil registry verification including birth, marriage and death records.",    col:"#0055ff",     bg:"rgba(0,85,255,0.08)" },
  { title:"Medical Billing – Exela Tech",     cat:"Biz Support",   desc:"Back-end billing support with accuracy in claims processing.",                        col:"#2d465e",     bg:"rgba(0,85,255,0.08)" },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden" style={{ background:"var(--d1)" }}>
      <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background:"radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)", transform:"translate(-20%,20%)" }}/>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-4">Our Work</div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)", lineHeight:1.06 }}>
              Projects That<br /><span className="tg-main">Deliver Results</span>
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
            className="max-w-md" style={{ color:"var(--text2)", fontSize:16, lineHeight:1.8 }}>
            Successful deliveries for international clients across the US, France and Australia.
          </motion.p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROJECTS.map((p,i) => (
            <motion.div key={i} variants={item}
              className="overflow-hidden rounded-2xl group cursor-default"
              style={{ background:p.bg, border:`1px solid ${p.col}22` }}
              whileHover={{ y:-8, boxShadow:`0 24px 56px ${p.col}25`, borderColor:`${p.col}55` }}>
              <div className="p-6">
                <motion.div className="h-0.5 rounded-full mb-5" style={{ background:`linear-gradient(90deg, ${p.col}, transparent)`, width:32 }}
                  whileHover={{ width:52 }} transition={{ duration:0.3 }}/>
                <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, color:p.col }}>{p.cat}</div>
                <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:16, color:"var(--ism-slate)", lineHeight:1.4, marginBottom:9 }}>{p.title}</h3>
                <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
