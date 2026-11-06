"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
export default function BackToTop() {
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>600);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  return (
    <AnimatePresence>
      {show&&(
        <motion.button
          initial={{ opacity:0, scale:0.7, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.7, y:16 }} whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          className="fixed bottom-8 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-xl cursor-pointer text-white"
          style={{ background:"var(--g-purple)" }} aria-label="Back to top">
          <ArrowUp size={18}/>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
