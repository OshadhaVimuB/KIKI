"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Mascot({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      aria-label="KIKI mascot"
      className={compact ? "relative h-12 w-12 shrink-0" : "relative h-24 w-24 shrink-0"}
      animate={{ y: [0, -6, 0], rotate: [0, -2, 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image src="/kiki-mascot.svg" alt="" fill priority sizes={compact ? "48px" : "96px"} className="drop-shadow-xl" />
    </motion.div>
  );
}
