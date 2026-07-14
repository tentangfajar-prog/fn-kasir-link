"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [username, setUsername] = useState("owner");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  async function submit() {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <Card>
      <CardHeader><CardTitle>Login</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <label className="block text-sm font-medium">Username</label>
        <input className="w-full rounded-md border border-slate-300 p-2" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label className="block text-sm font-medium">Password</label>
        <input className="w-full rounded-md border border-slate-300 p-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={submit}>Login</button>
        {result ? <pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">{result}</pre> : null}
      </CardContent>
    </Card>
  );
}
