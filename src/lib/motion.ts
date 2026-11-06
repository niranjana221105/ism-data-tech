import type { Variants } from "framer-motion";

/* Reveals retrigger on viewport entry in either scroll direction. */
export const vp       = { once: false, margin: "-80px" } as const;
export const vpEager  = { once: false, margin: "-40px" } as const;
export const viewport = vp;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16,1,0.3,1] } },
};
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.55 } },
};
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16,1,0.3,1] } },
};
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16,1,0.3,1] } },
};
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16,1,0.3,1] } },
};
export const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16,1,0.3,1] } },
};
export const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
};
export const staggerSm: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};
export const clipUp: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  show:   { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.75, ease: [0.16,1,0.3,1] } },
};
export const imageReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
  show:   { clipPath: "inset(0 0% 0 0)",   scale: 1,   transition: { duration: 0.85, ease: [0.16,1,0.3,1] } },
};
export const cardVariant = item;
export const fadeUpV     = fadeUp;
