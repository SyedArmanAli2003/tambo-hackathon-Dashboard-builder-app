import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTamboOrchestration } from "@/hooks/useTamboOrchestration";
import { useData } from "@/contexts/DataContext";
import DataUpload from "@/components/DataUpload";
import { motion } from "framer-motion";
import { Send, Loader2, Trash2 } from "lucide-react";

/**
 * Dashboard Builder Component
 * Integrates Tambo AI orchestration for dynamic component rendering
 * 
 * Design Philosophy: Modern Minimalist with AI Accent
 * - Chat interface for natural language input
 * - Real-time component rendering based on AI decisions
 * - Smooth animations and transitions
 */
export default function DashboardBuilder() {
  const [input, setInput] = useState("");
  const { activeDataset } = useData();
  const { components, loading, error, explanation, orchestrateDashboard, clearDashboard } =
    useTamboOrchestration();
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string; timestamp: string }>
  >([]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      type: "user" as const,
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Orchestrate dashboard with optional uploaded data
    await orchestrateDashboard(input, activeDataset ?? undefined);
  };

  // Add AI response when components are generated
  if (components.length > 0 && messages.length > 0 && !loading) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === "user") {
      const aiMessage = {
        type: "ai" as const,
        content: explanation,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }
  }

  const handleClear = () => {
    clearDashboard();
    setMessages([]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Builder</h1>
            <p className="text-sm text-slate-600">Powered by Tambo Generative UI</p>
          </div>
          <div className="flex items-center gap-2">
            <DataUpload />
            {(components.length > 0 || messages.length > 0) && (
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome State */}
          {messages.length === 0 && components.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Welcome to Dashboard Builder
                </h2>
                <p className="text-slate-600 mb-6">
                  Describe the dashboard you want to create in natural language. Tambo will
                  automatically generate the right components for you.
                </p>
                <div className="space-y-3 text-left bg-slate-50 rounded-lg p-6 mb-6">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Try asking for:</p>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-xl">📊</span> "Show me sales by region with revenue
                      trends"
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-xl">📈</span> "Create a user growth dashboard"
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-xl">🔗</span> "Analyze revenue vs customer correlation"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-4 mb-8">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.type === "user" ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-600">Generating dashboard...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Dashboard Components Grid */}
          {components.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {components.map((item: any, idx: number) => {
                const Component = item.component;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {Component && <Component {...item.instruction.props} />}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Tip */}
          {components.length === 0 && messages.length === 0 && (
            <div className="max-w-2xl mx-auto mt-8 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <span>💡</span> Tip: Describe what data you want to see, and the AI will render
                the right components
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your dashboard (e.g., 'Show me sales by region with revenue trends')..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {activeDataset ? (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                Using dataset: <strong>{activeDataset.name}</strong> ({activeDataset.rowCount} rows)
              </span>
            ) : (
              <>💡 Tip: Upload your own CSV/JSON data, or describe what you want to see</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
