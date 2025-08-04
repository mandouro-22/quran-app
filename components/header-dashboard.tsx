"use client";
import React from "react";
import { formatHijriDate } from "@/lib/format/format-date";
import { motion } from "motion/react";
interface Props {
  fullName: string;
}

export default function HeaderDashboard({ fullName }: Props) {
  const transition = {
    duration: 1,
  };
  const visible = {
    opacity: 1,
    y: 0,
  };
  const initial = "hidden";
  const animate = "visible";

  return (
    <motion.div
      initial={initial}
      animate={animate}
      variants={{
        hidden: {
          opacity: 0,
          y: -100,
        },
        visible: visible,
      }}
      transition={transition}
      className="flex flex-col items-start gap-2.5 space-y-3">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-700 dark:text-gray-200">
        {formatHijriDate(new Date())}
      </h1>
      <div className="flex flex-wrap items-center gap-2 text-2xl md:text-4xl font-extrabold">
        <span>أهلا بك يا</span>
        <h1 className="underline decoration-purple-400 decoration-slice decoration-4 text-gray-900 dark:text-white">
          {fullName}
        </h1>
        <span>فى موقع قرآنى</span>
      </div>
    </motion.div>
  );
}
