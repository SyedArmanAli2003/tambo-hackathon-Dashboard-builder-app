import { useState, useCallback } from "react";
import { z } from "zod";
import { componentRegistry } from "@/lib/componentRegistry";
import {
  salesData,
  regionSalesData,
  marketShareData,
  userGrowthData,
  revenueVsCustomersData,
  topCustomersData,
} from "@/lib/mockData";

/**
 * Component instruction schema - what Tambo AI returns
 */
const ComponentInstructionSchema = z.object({
  name: z.string(),
  props: z.any(),
});

type ComponentInstruction = z.infer<typeof ComponentInstructionSchema>;

interface DashboardComponent {
  id: string;
  instruction: ComponentInstruction;
  component: any;
}

interface TamboOrchestrationState {
  components: DashboardComponent[];
  loading: boolean;
  error: string | null;
  explanation: string;
}

/**
 * Hook that simulates Tambo AI orchestration
 * In production, this would call actual Tambo API
 */
export const useTamboOrchestration = () => {
  const [state, setState] = useState<TamboOrchestrationState>({
    components: [],
    loading: false,
    error: null,
    explanation: "",
  });

  /**
   * Analyze user request and generate component instructions
   * This simulates what Tambo's AI would do
   */
  const analyzeRequest = useCallback((userRequest: string): ComponentInstruction[] => {
    const request = userRequest.toLowerCase();

    // Keyword-based component selection (simulating AI decision-making)
    const instructions: ComponentInstruction[] = [];

    // Sales/Revenue related
    if (request.includes("sales") || request.includes("revenue")) {
      // Add KPI cards
      instructions.push({
        name: "KPICard",
        props: {
          title: "Total Revenue",
          value: "$487,000",
          trend: "+12.5%",
          color: "blue",
          isPositive: true,
        },
      });

      // Add revenue trend chart
      instructions.push({
        name: "LineChart",
        props: {
          title: "Monthly Revenue Trend",
          data: salesData,
          xAxis: "month",
          yAxis: "revenue",
          color: "#3b82f6",
        },
      });

      // Add regional sales chart if "region" is mentioned
      if (request.includes("region")) {
        instructions.push({
          name: "BarChart",
          props: {
            title: "Sales by Region",
            data: regionSalesData,
            xAxis: "region",
            yAxis: "sales",
            color: "#06b6d4",
          },
        });
      }

      // Add top customers if mentioned
      if (request.includes("customer")) {
        instructions.push({
          name: "DataTable",
          props: {
            title: "Top Customers",
            columns: ["name", "revenue", "status", "growth"],
            data: topCustomersData,
          },
        });
      }
    }

    // User/Growth related
    if (request.includes("user") || request.includes("growth")) {
      instructions.push({
        name: "KPICard",
        props: {
          title: "User Growth",
          value: "9,200",
          trend: "+18.3%",
          color: "green",
          isPositive: true,
        },
      });

      instructions.push({
        name: "LineChart",
        props: {
          title: "User Growth Over Time",
          data: userGrowthData,
          xAxis: "date",
          yAxis: "users",
          color: "#10b981",
        },
      });

      // Add conversion rate if mentioned
      if (request.includes("conversion")) {
        instructions.push({
          name: "KPICard",
          props: {
            title: "Conversion Rate",
            value: "3.8%",
            trend: "+0.5%",
            color: "purple",
            isPositive: true,
          },
        });
      }
    }

    // Market/Competition related
    if (request.includes("market") || request.includes("share")) {
      instructions.push({
        name: "PieChart",
        props: {
          title: "Market Share",
          data: marketShareData,
        },
      });
    }

    // Correlation/Analysis related
    if (request.includes("correlation") || request.includes("analyze")) {
      instructions.push({
        name: "ScatterPlot",
        props: {
          title: "Revenue vs Customer Count",
          data: revenueVsCustomersData,
          xLabel: "Customers",
          yLabel: "Revenue ($)",
          color: "#f59e0b",
        },
      });
    }

    // Insights/Summary
    if (instructions.length > 0) {
      instructions.push({
        name: "TextBlock",
        props: {
          title: "Key Insights",
          content: generateInsights(request),
        },
      });
    }

    return instructions;
  }, []);

  /**
   * Generate AI explanation for the dashboard
   */
  const generateExplanation = (request: string, componentCount: number): string => {
    return `I've generated a dashboard with ${componentCount} components based on your request. The dashboard includes charts, metrics, and data tables to help you visualize your data.`;
  };

  /**
   * Generate insights text based on request
   */
  const generateInsights = (request: string): string => {
    const insights = [
      "Revenue increased by 12.5% this month, driven primarily by strong performance in the East region (+18% growth).",
      "Active users reached 9,200, up 18.3% from last month. The conversion rate improved to 3.8%, indicating better product-market fit.",
      "Top customer (Global Solutions) contributed $156,000 in revenue. Consider expanding services for this segment.",
      "Market share grew to 28%, positioning us as the second-largest player in our category.",
    ];

    return insights.join(" ");
  };

  /**
   * Process user request and orchestrate component rendering
   */
  const orchestrateDashboard = useCallback(async (userRequest: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Analyze request and get component instructions
      const instructions = analyzeRequest(userRequest);

      if (instructions.length === 0) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Could not understand your request. Try asking for sales, users, market share, or correlation analysis.",
          explanation: "",
          components: [],
        }));
        return;
      }

      // Convert instructions to renderable components
      const components: DashboardComponent[] = instructions.map((instruction, index) => {
        const registry = componentRegistry[instruction.name as keyof typeof componentRegistry];

        if (!registry) {
          console.warn(`Component ${instruction.name} not found in registry`);
          return null;
        }

        return {
          id: `${instruction.name}-${index}`,
          instruction,
          component: registry.component as any,
        };
      }).filter((c): c is DashboardComponent => c !== null);

      const explanation = generateExplanation(userRequest, components.length);

      setState((prev) => ({
        ...prev,
        loading: false,
        components,
        explanation,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred",
      }));
    }
  }, [analyzeRequest]);

  /**
   * Clear dashboard
   */
  const clearDashboard = useCallback(() => {
    setState({
      components: [],
      loading: false,
      error: null,
      explanation: "",
    });
  }, []);

  return {
    ...state,
    orchestrateDashboard,
    clearDashboard,
  };
};
