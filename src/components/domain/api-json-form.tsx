"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ApiJsonFormProps = {
  title: string;
  description: string;
  endpoint: string;
  method?: "GET" | "POST";
  initialJson?: string;
};

export function ApiJsonForm({ title, description, endpoint, method = "POST", initialJson = "{}" }: ApiJsonFormProps) {
  const [body, setBody] = useState(initialJson);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch(endpoint, {
        method,
        headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body: method === "POST" ? body : undefined,
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ ok: false, error: String(error) }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{description}</p>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-semibold">{method}</span> {endpoint}
        </div>
        {method === "POST" ? (
          <textarea className="min-h-44 w-full rounded-md border border-slate-300 p-3 font-mono text-sm" value={body} onChange={(event) => setBody(event.target.value)} />
        ) : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" onClick={submit} disabled={loading}>
          {loading ? "Memproses..." : method === "GET" ? "Ambil Data" : "Kirim"}
        </button>
        {result ? <pre className="max-h-96 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">{result}</pre> : null}
      </CardContent>
    </Card>
  );
}
