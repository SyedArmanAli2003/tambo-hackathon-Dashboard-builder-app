import { z } from "zod";
import KPICard from "@/components/dashboard/KPICard";
import LineChart from "@/components/dashboard/LineChart";
import BarChart from "@/components/dashboard/BarChart";
import PieChart from "@/components/dashboard/PieChart";
import DataTable from "@/components/dashboard/DataTable";
import ScatterPlot from "@/components/dashboard/ScatterPlot";
import StatCard from "@/components/dashboard/StatCard";
import TextBlock from "@/components/dashboard/TextBlock";

/**
 * Tambo Component Registry
 * Registers all dashboard components that Tambo AI can render
 * 
 * Note: Tambo requires explicit object schemas without z.record() for dynamic keys
 */

// KPI Card Component
export const KPICardSchema = z.object({
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  trend: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isPositive: z.boolean().optional(),
});

// Line Chart Component
export const LineChartSchema = z.object({
  title: z.string(),
  data: z.array(z.any()).optional(),
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
  color: z.string().optional(),
  height: z.number().optional(),
});

// Bar Chart Component
export const BarChartSchema = z.object({
  title: z.string(),
  data: z.array(z.any()).optional(),
  xAxis: z.string().optional(),
  yAxis: z.string().optional(),
  color: z.string().optional(),
  height: z.number().optional(),
});

// Pie Chart Component
export const PieChartSchema = z.object({
  title: z.string(),
  data: z.array(z.any()).optional(),
  height: z.number().optional(),
});

// Data Table Component
export const DataTableSchema = z.object({
  title: z.string(),
  columns: z.array(z.string()).optional(),
  data: z.array(z.any()).optional(),
  sortable: z.boolean().optional(),
});

// Scatter Plot Component
export const ScatterPlotSchema = z.object({
  title: z.string(),
  data: z.array(z.any()).optional(),
  xLabel: z.string().optional(),
  yLabel: z.string().optional(),
  color: z.string().optional(),
  height: z.number().optional(),
});

// Stat Card Component
export const StatCardSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  change: z.string().optional(),
  isPositive: z.boolean().optional(),
});

// Text Block Component
export const TextBlockSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Component Registry
export const componentRegistry = {
  KPICard: {
    component: KPICard,
    schema: KPICardSchema,
    description: "Display a key performance indicator with value and trend",
  },
  LineChart: {
    component: LineChart,
    schema: LineChartSchema,
    description: "Display time-series data as a line chart",
  },
  BarChart: {
    component: BarChart,
    schema: BarChartSchema,
    description: "Display categorical data as a bar chart",
  },
  PieChart: {
    component: PieChart,
    schema: PieChartSchema,
    description: "Display proportional data as a pie chart",
  },
  DataTable: {
    component: DataTable,
    schema: DataTableSchema,
    description: "Display data in a sortable table format",
  },
  ScatterPlot: {
    component: ScatterPlot,
    schema: ScatterPlotSchema,
    description: "Display correlation between two variables",
  },
  StatCard: {
    component: StatCard,
    schema: StatCardSchema,
    description: "Display a statistic with label and value",
  },
  TextBlock: {
    component: TextBlock,
    schema: TextBlockSchema,
    description: "Display text content and insights",
  },
};

export type ComponentName = keyof typeof componentRegistry;
