type GradientColor = { from: string; to: string };

export const TECH_COLORS: Record<string, GradientColor> = {
  Java: { from: "#f97316", to: "#ef4444" },
  "Spring Boot": { from: "#22c55e", to: "#16a34a" },
  Kafka: { from: "#1e293b", to: "#475569" },
  Python: { from: "#3b82f6", to: "#eab308" },
  FastAPI: { from: "#059669", to: "#10b981" },
  LangChain: { from: "#22d3ee", to: "#8b5cf6" },
  React: { from: "#38bdf8", to: "#818cf8" },
  "Next.js": { from: "#171717", to: "#525252" },
  "Node.js": { from: "#22c55e", to: "#15803d" },
  TypeScript: { from: "#3b82f6", to: "#1d4ed8" },
  Vite: { from: "#a78bfa", to: "#f59e0b" },
  Express: { from: "#64748b", to: "#334155" },
  Go: { from: "#06b6d4", to: "#0ea5e9" },
  Rust: { from: "#f97316", to: "#dc2626" },
  "Actix-web": { from: "#ef4444", to: "#f97316" },
  PostgreSQL: { from: "#3b82f6", to: "#6366f1" },
  MongoDB: { from: "#22c55e", to: "#15803d" },
  Redis: { from: "#ef4444", to: "#dc2626" },
  SQLite: { from: "#0ea5e9", to: "#3b82f6" },
  Supabase: { from: "#22c55e", to: "#059669" },
  OpenAI: { from: "#10b981", to: "#059669" },
  Pinecone: { from: "#06b6d4", to: "#0891b2" },
  Whisper: { from: "#64748b", to: "#475569" },
  "GPT-4": { from: "#8b5cf6", to: "#6d28d9" },
  Docker: { from: "#2563eb", to: "#1d4ed8" },
  Vercel: { from: "#171717", to: "#404040" },
  Tailwind: { from: "#06b6d4", to: "#0284c7" },
  "Tailwind CSS v4": { from: "#06b6d4", to: "#0284c7" },
  CSS: { from: "#2563eb", to: "#7c3aed" },
  "D3.js": { from: "#f97316", to: "#ef4444" },
  "Chart.js": { from: "#ef4444", to: "#ec4899" },
  ProseMirror: { from: "#6366f1", to: "#8b5cf6" },
  CodeMirror: { from: "#d97706", to: "#ea580c" },
  WebSocket: { from: "#8b5cf6", to: "#6d28d9" },
  "Socket.io": { from: "#171717", to: "#525252" },
  PWA: { from: "#7c3aed", to: "#a855f7" },
  CLI: { from: "#64748b", to: "#475569" },
  LocalStorage: { from: "#f59e0b", to: "#eab308" },
  MQTT: { from: "#7c3aed", to: "#6d28d9" },
  "Raspberry Pi": { from: "#dc2626", to: "#22c55e" },
  InfluxDB: { from: "#8b5cf6", to: "#3b82f6" },
  Grafana: { from: "#f97316", to: "#eab308" },
  "GitHub API": { from: "#171717", to: "#525252" },
  Sanity: { from: "#ef4444", to: "#f97316" },
  Elasticsearch: { from: "#f59e0b", to: "#22c55e" },
  "Apache Airflow": { from: "#06b6d4", to: "#059669" },
  "Slack Bolt": { from: "#611f69", to: "#e01e5a" },
  "cron-parser": { from: "#64748b", to: "#475569" },
  "AES-256": { from: "#22c55e", to: "#059669" },
  Puppeteer: { from: "#22c55e", to: "#059669" },
  "Faker.js": { from: "#8b5cf6", to: "#a855f7" },
  "DnD Kit": { from: "#3b82f6", to: "#8b5cf6" },
  gRPC: { from: "#06b6d4", to: "#3b82f6" },
  "FFmpeg.wasm": { from: "#22c55e", to: "#15803d" },
  "MediaRecorder API": { from: "#ef4444", to: "#f97316" },
  MDX: { from: "#f59e0b", to: "#eab308" },
  Sharp: { from: "#22c55e", to: "#059669" },
  Wasm: { from: "#6366f1", to: "#8b5cf6" },
  Zustand: { from: "#f97316", to: "#eab308" },
  Lucide: { from: "#f97316", to: "#ef4444" },
  S3: { from: "#f59e0b", to: "#ea580c" },
  AWS: { from: "#f59e0b", to: "#d97706" },
};

const DEFAULT_GRADIENT: GradientColor = { from: "#64748b", to: "#475569" };

export function getTechGradient(tech: string): GradientColor {
  return TECH_COLORS[tech] ?? DEFAULT_GRADIENT;
}

export function getTechGradientCSS(tech: string): string {
  const { from, to } = getTechGradient(tech);
  return `linear-gradient(135deg, ${from}, ${to})`;
}
