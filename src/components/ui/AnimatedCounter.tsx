"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
interface Props { end:number; suffix?:string; duration?:number; }
export default function AnimatedCounter({ end, suffix="", duration=2000 }:Props) {
  const count = useMotionValue(0);
  const display = useTransform(count, value => `${Math.floor(value)}${suffix}`);
  const ref=useRef<HTMLSpanElement>(null);
  const inView=useInView(ref,{once:false,margin:"-50px"});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      count.set(end);
      return;
    }

    const controls = animate(count, end, { duration: duration / 1000, ease: "easeOut" });
    return () => controls.stop();
  }, [count, duration, end, inView, prefersReducedMotion]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
