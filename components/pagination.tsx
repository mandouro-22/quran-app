import React from "react";
import { motion } from "motion/react";
import { formatDay } from "@/lib/format/format-date";

interface PaginationState {
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

interface Props {
  pagination: PaginationState;
  setpagintaion: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export default function Pagination({ pagination, setpagintaion }: Props) {
  return (
    <div className="flex items-center justify-center my-8 gap-4">
      <motion.button
        onClick={() =>
          setpagintaion((prev) => ({
            ...prev,
            currentPage: prev.currentPage - 1,
          }))
        }
        disabled={pagination.currentPage === 1}
        className="font-medium flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white shadow h-9 px-4 py-2 transition-all rounded-lg disabled:opacity-80 disabled:cursor-not-allowed text-sm"
        whileTap={{ scale: 0.8 }}>
        رجوع
      </motion.button>
      <span className="">
        {formatDay(pagination.currentPage)} / {formatDay(pagination.totalPage)}
      </span>
      <motion.button
        onClick={() =>
          setpagintaion((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }))
        }
        className="font-medium flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white shadow h-9 px-4 py-2 transition-all rounded-lg disabled:opacity-80 disabled:cursor-not-allowed text-sm"
        whileTap={{ scale: 0.8 }}
        disabled={pagination.currentPage === pagination.totalPage}>
        التالى
      </motion.button>
    </div>
  );
}
