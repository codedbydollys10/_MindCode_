type SupportedLanguage = "python" | "javascript" | "java" | "cpp" | "c" | "go" | "rust";

const LANGUAGE_IDS: Record<SupportedLanguage, number> = {
  python: 71, // Python (3.8.1) in Judge0 CE
  javascript: 63, // JavaScript (Node.js 18.x)
  java: 62, // Java (OpenJDK 17)
  cpp: 54, // C++ (GCC 9.2.0)
  c: 50, // C (GCC 9.2.0)
  go: 60, // Go (1.13.5)
  rust: 73, // Rust (1.56)
};

const API_BASE = import.meta.env.VITE_CODE_RUNNER_URL || "https://mindcode-4v9p.onrender.com";

export const runCode = async (params: {
  language: SupportedLanguage;
  code: string;
  stdin?: string;
}) => {
  const language_id = LANGUAGE_IDS[params.language];
  const response = await fetch(`${API_BASE}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: params.code,
      language_id,
      stdin: params.stdin ?? "",
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to run code");
  }

  return response.json() as Promise<{
    output: string;
    error: string;
    status: string;
    statusId?: number;
    time?: number;
    memory?: number;
  }>;
};
