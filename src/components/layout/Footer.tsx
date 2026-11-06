import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background:"var(--ism-navy)", borderTop:"1px solid rgba(0,85,255,0.25)" }}>
      <style>{`
        .fl { color:rgba(255,255,255,0.62); font-size:15.5px; font-weight:500; transition:color .2s; display:flex; align-items:center; gap:4px; line-height:1.6; }
        .fl:hover { color:#fff; }
        .fs { color:rgba(255,255,255,0.62); font-size:15px; font-weight:500; transition:color .2s; line-height:1.6; }
        .fs:hover { color:var(--cyan); }
        .fm { color:rgba(255,255,255,0.62); font-size:15px; font-weight:500; display:block; transition:color .2s; line-height:1.6; }
        .fm:hover { color:var(--cyan); }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div style={{ width:38, height:38, borderRadius:10, overflow:"hidden", position:"relative", flexShrink:0, border:"1px solid rgba(0,85,255,0.3)" }}>
                <Image src="/images/brand/ismicon.jpeg" alt="ISM Data Technology" fill sizes="38px" className="object-contain"/>
              </div>
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily:"var(--font-sans)", fontWeight:800, color:"#fff", fontSize:14, letterSpacing:"0.04em" }}>ISM DATA</span>
                <span style={{ fontSize:9.5, color:"var(--cyan)", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:700 }}>Technology</span>
              </div>
            </Link>
            <p style={{ color:"rgba(255,255,255,0.68)", fontSize:14.5, lineHeight:1.8, fontWeight:400 }}>
              Delivering accurate, scalable data management and IT-enabled services worldwide since 2024.
            </p>
          </div>

          {/* Quick Links — no Admin Portal here */}
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-sans)", fontWeight:800, fontSize:13, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:16 }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                ["/",          "Home"],
                ["/#about",    "About Us"],
                ["/#services", "Services"],
                ["/#projects", "Our Work"],
                ["/#life",     "Life at ISM"],
                ["/careers",   "Careers"],
                ["/contact",   "Contact"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="fl group">
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"/>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-sans)", fontWeight:800, fontSize:13, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:16 }}>
              Services
            </h3>
            <ul className="space-y-2.5">
              {["EPUB Services","Healthcare Data Entry","Vital Records – USA","Spanish Data Projects","Newspaper Zoning","USA Documentation","Australian Scraping","XML Processing"].map(s => (
                <li key={s}><Link href="/#services" className="fs">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color:"#fff", fontFamily:"var(--font-sans)", fontWeight:800, fontSize:13, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:16 }}>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--cyan)" }}/>
                <span style={{ color:"rgba(255,255,255,0.68)", fontSize:14.5, lineHeight:1.8, fontWeight:400 }}>
                  Selva Complex, V.A. Nagar,<br/>Kadayam Road, Pavoorchatram,<br/>Tenkasi, Tamil Nadu – 627808, India
                </span>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--cyan)" }}/>
                <div className="space-y-1.5">
                  <a href={`mailto:${COMPANY_INFO.email}`} className="fm">{COMPANY_INFO.email}</a>
                  <a href={`mailto:${COMPANY_INFO.hrEmail}`} className="fm">{COMPANY_INFO.hrEmail}</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--cyan)" }}/>
                <span style={{ color:"rgba(255,255,255,0.68)", fontSize:14.5, lineHeight:1.7, fontWeight:400 }}>{COMPANY_INFO.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar: copyright | Privacy Policy · Sitemap · Admin Portal ── */}
        <div className="border-t py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor:"rgba(0,85,255,0.12)" }}>

          {/* Left: copyright */}
          <p style={{ color:"rgba(255,255,255,0.68)", fontSize:13.5 }}>
            © {year} ISM Data Technology. All rights reserved.
          </p>

          {/* Right: Privacy Policy | Sitemap | Admin Portal */}
          <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy" className="fs">Privacy Policy</Link>
            <Link href="/sitemap.xml" className="fs">Sitemap</Link>

            {/* Admin Portal — far right, subtle professional link */}
            <Link
              href="/admin/careers"
              className="flex items-center gap-1.5 transition-colors duration-200"
              style={{
                color:"rgba(255,255,255,0.78)",
                fontSize:12,
                fontWeight:600,
                letterSpacing:"0.04em",
                paddingLeft:16,
                borderLeft:"1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={undefined}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
