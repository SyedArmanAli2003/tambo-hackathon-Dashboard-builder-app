import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: "DollarSign" | "Users" | "TrendingUp" | "Star";
  color?: "blue" | "green" | "purple" | "orange" | "red";
  isPositive?: boolean;
}

/**
 * KPICard Component
 * Displays a single key performance indicator with value, trend, and icon
 * Design: Modern card with gradient background and smooth animations
 */
export default function KPICard({
  title,
  value,
  trend,
  icon = "DollarSign",
  color = "blue",
  isPositive = true,
}: KPICardProps) {
  const iconMap = {
    DollarSign: DollarSign,
    Users: Users,
    TrendingUp: TrendingUp,
    Star: Star,
  };

  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/30",
      icon: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30",
      icon: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30",
      icon: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
  };

  const IconComponent = iconMap[icon];
  const colors = colorMap[color];
  const trendIsPositive = trend?.startsWith("+") || isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`${colors.bg} ${colors.border} border-2 p-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{value}</h3>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  trendIsPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendIsPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`${colors.icon} p-3 bg-white dark:bg-slate-800 rounded-lg`}>
            <IconComponent className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
