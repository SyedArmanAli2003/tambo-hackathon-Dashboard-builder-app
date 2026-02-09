import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TextBlockProps {
  title: string;
  content: string;
}

/**
 * TextBlock Component
 * Displays informational text and insights
 * Design: Clean card with readable typography
 */
export default function TextBlock({ title, content }: TextBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/40 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </Card>
    </motion.div>
  );
}
