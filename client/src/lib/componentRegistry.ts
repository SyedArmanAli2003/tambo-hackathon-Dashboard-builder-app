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
    description:
      "Display a single key performance indicator (KPI) card. Use this when the user asks for a metric summary, a single stat, or an overview number. Props: title (string), value (string|number — the computed metric like '$1.2M' or 42), trend (string like '+12.5%'), icon ('DollarSign'|'Users'|'TrendingUp'|'Star'), color ('blue'|'green'|'purple'|'orange'|'red'), isPositive (boolean). You MUST compute the actual value from the dataset — e.g. sum a column, count rows, compute an average.",
  },
  LineChart: {
    component: LineChart,
    schema: LineChartSchema,
    description:
      "Display time-series or trend data as a line chart. Use when the user asks for trends over time, growth, monthly/weekly comparisons. Props: title (string), data (array of objects — each object must have a key for xAxis and yAxis), xAxis (string — the key name in data for X values, e.g. 'month' or 'Date'), yAxis (string — the key name for Y values, e.g. 'Revenue' or 'count'), color (string hex), height (number). You MUST aggregate the raw data yourself into the correct format. For example, if user asks 'revenue trend', group by Date and sum Revenue.",
  },
  BarChart: {
    component: BarChart,
    schema: BarChartSchema,
    description:
      "Display categorical comparison data as a bar chart. Use when the user asks to compare values across categories like regions, products, departments, channels. Props: title (string), data (array of objects — each must have a key for xAxis and yAxis), xAxis (string — the key in data objects for category labels), yAxis (string — the key for numeric values), color (string hex), height (number). You MUST aggregate the data: group by the categorical column and sum/average the numeric column.",
  },
  PieChart: {
    component: PieChart,
    schema: PieChartSchema,
    description:
      "Display proportional/percentage data as a pie chart. Use when user asks about distribution, share, breakdown, or proportion. Props: title (string), data (array of {name: string, value: number} — MUST be this exact format), height (number). You MUST aggregate and transform data into [{name, value}] format. For example, for 'revenue by region', compute sum of Revenue per Region.",
  },
  DataTable: {
    component: DataTable,
    schema: DataTableSchema,
    description:
      "Display data in a sortable table. Use when user asks to show raw data, a list, a table, top N items, or detailed records. Props: title (string), columns (array of column name strings), data (array of row objects), sortable (boolean). You can pass a subset of the data (e.g. top 10 by some metric) or the full dataset.",
  },
  ScatterPlot: {
    component: ScatterPlot,
    schema: ScatterPlotSchema,
    description:
      "Display a scatter plot showing correlation/relationship between two numeric variables. Use when user asks about correlation, relationship, scatter, or comparing two metrics. Props: title (string), data (array of {x: number, y: number}), xLabel (string), yLabel (string), color (string hex), height (number). Transform the data into [{x, y}] from the relevant numeric columns.",
  },
  StatCard: {
    component: StatCard,
    schema: StatCardSchema,
    description:
      "Display a small stat card with a label and value. Use for simple single metrics alongside other components. Props: label (string), value (string|number), change (string like '+8.2%'), isPositive (boolean).",
  },
  TextBlock: {
    component: TextBlock,
    schema: TextBlockSchema,
    description:
      "Display text analysis, insights, or explanations. Use when the user asks a question that needs a written answer, analysis, summary, or narrative insight about the data. Props: title (string), content (string — the full text with your analysis). Write clear, data-driven insights referencing actual numbers from the dataset.",
  },
};

export type ComponentName = keyof typeof componentRegistry;
