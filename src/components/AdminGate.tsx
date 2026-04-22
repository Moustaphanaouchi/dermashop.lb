"use client";

import React from "react";
import { Button } from "@/components/Button";
import { safeJsonParse, STORAGE_KEYS } from "@/state/storage";

function getConfiguredPasscode() {
  return (process.env.NEXT_PUBLIC_ADMIN_PASSCODE ?? "DERMASHOP").trim();
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const existing = safeJsonParse<{ authed: boolean }>(sessionStorage.getItem(STORAGE_KEYS.adminAuthed));
    if (existing?.authed) setAuthed(true);
  }, []);

  if (authed) return <>{children}</>;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-luxeSoft ring-1 ring-zinc-900/5">
        <div className="text-lg font-semibold tracking-tight">Admin Access</div>
        <div className="mt-1 text-sm text-zinc-600">
          Enter your passcode to manage stock status and pricing (saved to this browser).
        </div>

        <div className="mt-6 space-y-3">
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passcode"
            type="password"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
          />
          {error ? <div className="text-sm font-semibold text-maroon-800">{error}</div> : null}
          <Button
            className="w-full"
            onClick={() => {
              const expected = getConfiguredPasscode();
              if (pass.trim() !== expected) {
                setError("Incorrect passcode.");
                return;
              }
              sessionStorage.setItem(STORAGE_KEYS.adminAuthed, JSON.stringify({ authed: true }));
              setAuthed(true);
            }}
          >
            Unlock Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

