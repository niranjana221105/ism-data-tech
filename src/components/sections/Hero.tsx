"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ── Particle canvas ──────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let raf: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = window.matchMedia("(max-width: 767px)").matches ? 22 : 48;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() > 0.5 ? 216 : 224,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > c.width)  n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
      });
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${a.hue},80%,65%,${0.22 * (1 - d / 130)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }));
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue},80%,70%,0.85)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35 }} />;
}

/* ── SVG data-network decoration ─────── */
function DataNetwork() {
  const pts = [
    [260, 230], [100, 130], [420, 115], [55, 310],
    [450, 325], [185, 375], [345, 365], [195, 65], [325, 70],
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4],[5,6],[1,7],[2,8]];
  return (
    <svg viewBox="0 0 520 500" className="absolute inset-0 w-full h-full" fill="none">
      <defs>
        <linearGradient id="ng1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#012367" /><stop offset="100%" stopColor="#0055ff" />
        </linearGradient>
        <linearGradient id="ng2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d465e" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#0055ff" stopOpacity="0.5"/>
        </linearGradient>
        <radialGradient id="ngc"><stop offset="0%" stopColor="#0055ff" stopOpacity="0.25"/><stop offset="100%" stopColor="transparent"/></radialGradient>
        <filter id="nglow"><feGaussianBlur stdDeviation="5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>
      {/* Central glow */}
      <circle cx="260" cy="230" r="90" fill="url(#ngc)" />
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke="url(#ng2)" strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
        />
      ))}
      {/* Orbit rings */}
      {[110, 70, 40].map((r, i) => (
        <circle key={r} cx="260" cy="230" r={r}
          stroke={`rgba(0,85,255,${0.08 + i * 0.06})`} strokeWidth="1"
          style={{ animation: `${i % 2 === 0 ? "spin-cw" : "spin-ccw"} ${25 + i * 10}s linear infinite`, transformOrigin: "260px 230px" }}
        />
      ))}
      {/* Nodes */}
      {pts.map(([x, y], i) => (
        <g key={i}>
          {i === 0 && <motion.circle cx={x} cy={y} r={28} fill="rgba(0,85,255,0.12)"
            animate={{ r: [22, 34, 22] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />}
          <motion.circle cx={x} cy={y} r={i === 0 ? 16 : 8}
            fill={i === 0 ? "url(#ng1)" : "rgba(0,85,255,0.7)"}
            filter="url(#nglow)"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 240 }}
          />
        </g>
      ))}
      {/* Data labels */}
      {[{ x:370, y:100, t:"ANALYTICS" },{ x:44, y:298, t:"GLOBAL" },{ x:418, y:318, t:"SECURE" }].map(({ x, y, t }, i) => (
        <motion.text key={t} x={x} y={y} fill="rgba(117,165,255,0.55)"
          fontSize="10" fontWeight="700" letterSpacing="3" fontFamily="Plus Jakarta Sans,sans-serif"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + i * 0.2 }}>
          {t}
        </motion.text>
      ))}
    </svg>
  );
}

/* ── Floating stat badges ─────────────── */
const STATS = [
  { v:"98%", l:"Quality",  top:"8%",  left:"-10%", delay:1.0 },
  { v:"3+",  l:"Partners", top:"74%", left:"-8%",  delay:1.2 },
  { v:"24/7",l:"Support",  top:"5%",  right:"-6%", delay:1.4 },
];

/* ── Ticker items ─────────────────────── */
const TICKER = [
  "Data Entry","EPUB Conversion","Healthcare Records","Vital Records USA",
  "Voice Support","Australian Leads","XML Processing","Baptism Indexing","Newspaper Zoning",
];

/* ── Headline lines ──────────────────── */
const LINES = [
  { text:"Intelligent",    serif:false },
  { text:"Data Solutions", serif:true  },
  { text:"That Move",      serif:false },
  { text:"Business Forward.", grad:true },
];

const heroVideoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_SRC?.trim();

/* ── Main ────────────────────────────── */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 20, damping: 30 });
  const sy = useSpring(my, { stiffness: 20, damping: 30 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const prefersReducedMotion = useReducedMotion();
  const [desktopVideoEnabled, setDesktopVideoEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktopVideoEnabled(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - left) / width  - 0.5) * 28);
    my.set(((e.clientY - top)  / height - 0.5) * 28);
  };

  return (
    <section
      ref={heroRef}
      className="hero-section relative overflow-hidden"
      style={{ background: "var(--d1)", minHeight: "100svh", display: "flex", flexDirection: "column" }}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div className="hero-media" aria-hidden="true"
        style={{ y: prefersReducedMotion ? 0 : mediaY, scale: prefersReducedMotion ? 1 : mediaScale }}>
        <Image
          src="/images/corporate/hero-analytics.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="hero-fallback-image"
        />
        {heroVideoSrc && desktopVideoEnabled && !prefersReducedMotion && (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/corporate/hero-analytics.jpg"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="hero-media-overlay" aria-hidden="true" />

      {/* ── Layered atmospheric background ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {/* Base radial glow */}
        <div style={{ position:"absolute", inset:0, background:"var(--g-hero)" }} />
        {/* Hex grid */}
        <div className="absolute inset-0 hex-grid opacity-40" />
        {/* Corner lighting */}
        <div style={{ position:"absolute", top:"-20%", right:"-10%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,85,255,0.12) 0%, transparent 65%)" }}/>
        <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(140,164,188,0.10) 0%, transparent 70%)" }}/>
        {/* Top edge glow strip */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg, transparent, rgba(0,85,255,0.6), transparent)" }}/>
      </div>

      {/* Particle field */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-5 sm:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center w-full">

          {/* LEFT */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{ background:"rgba(0,85,255,0.18)", border:"1px solid rgba(117,165,255,0.34)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--cyan)", animation:"pulseDot 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:12, fontWeight:700, color:"var(--cyan)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                Global Data & IT Services
              </span>
            </motion.div>

            {/* Animated headline */}
            <h1 className="mb-8">
              {LINES.map((ln, i) => (
                <div key={i} style={{ overflow:"hidden", lineHeight:1 }}>
                  <motion.div
                    initial={{ y:"115%", opacity:0 }}
                    animate={{ y:0, opacity:1 }}
                    transition={{ duration:0.85, delay:0.12 + i * 0.1, ease:[0.16,1,0.3,1] }}
                    style={{
                      display:"block",
                      fontFamily: ln.serif ? "var(--font-serif)" : "var(--font-sans)",
                      fontStyle: ln.serif ? "italic" : "normal",
                      fontWeight: 800,
                      fontSize:"clamp(2.45rem, 6.2vw, 4.9rem)",
                      lineHeight: 1.06,
                      letterSpacing:"-0.04em",
                      paddingBottom:"0.04em",
                      color: ln.grad ? "transparent" : "var(--white)",
                      backgroundImage: ln.grad ? "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)" : "none",
                      WebkitBackgroundClip: ln.grad ? "text" : "unset",
                      WebkitTextFillColor: ln.grad ? "transparent" : "unset",
                      backgroundClip: ln.grad ? "text" : "unset",
                    }}>
                    {ln.text}
                  </motion.div>
                </div>
              ))}
            </h1>

            {/* Sub */}
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.72, duration:0.65 }}
              style={{ color:"#e1e9f5", fontSize:"clamp(1rem,1.35vw,1.15rem)", lineHeight:1.8, maxWidth:500, marginBottom:36 }}>
              Empowering global businesses through precision data management, IT-enabled operations and scalable technology services — from Tamil Nadu, India.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.85 }}
              className="flex flex-wrap gap-4 mb-12">
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Link href="/#services" className="btn-primary">Explore Services <ArrowRight size={16}/></Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Link href="/contact" className="btn-outline">Let&apos;s Talk <ArrowUpRight size={15}/></Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.05 }}
              className="flex flex-wrap gap-8 pt-7"
              style={{ borderTop:"1px solid rgba(255,255,255,0.08)" }}>
              {[{ v:"98%",l:"Quality" },{ v:"3+",l:"Int'l Partners" },{ v:"24/7",l:"Live Support" }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:22, letterSpacing:"-0.02em", background:"var(--g-text)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.v}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", fontWeight:600, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div style={{ x:sx, y:sy, height:480 }} className="relative hidden lg:block">
            <motion.div initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.3, duration:0.9, ease:[0.16,1,0.3,1] }} className="w-full h-full relative">
              <div className="absolute inset-0 opacity-75">
                <DataNetwork />
              </div>
              {STATS.map((s, i) => (
                <motion.div key={i}
                  className="absolute card-dark px-4 py-3 text-center"
                  style={{ top:s.top, left:s.left, right:(s as {right?:string}).right, minWidth:84, zIndex:10 }}
                  initial={{ opacity:0, scale:0.75, y:10 }} animate={{ opacity:1, scale:1, y:0 }}
                  transition={{ delay:s.delay, type:"spring", stiffness:220 }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:20, letterSpacing:"-0.02em", background:"var(--g-text)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.v}</div>
                  <div style={{ fontSize:12, color:"var(--ism-slate)", fontWeight:600, marginTop:3 }}>{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 w-full overflow-hidden py-3.5"
        style={{ borderTop:"1px solid rgba(0,85,255,0.15)", background:"rgba(8,13,27,0.7)", backdropFilter:"blur(12px)" }}>
        <div className="anim-marquee flex gap-10 w-max">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color:"var(--text3)" }}>
              {t}<span style={{ color:"var(--blue)", fontSize:8 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
