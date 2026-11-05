"use client";

import { FormEvent, useMemo, useState } from "react";
import { type RsvpRow } from "@/lib/supabase";

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export function RsvpInbox() {
  const [rows, setRows] = useState<RsvpRow[] | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const stats = useMemo(() => {
    if (!rows) return null;
    const yes = rows.filter((r) => r.attendance === "yes");
    return {
      replies: rows.length,
      coming: yes.length,
      declined: rows.length - yes.length,
      seats: yes.reduce((n, r) => n + r.guests, 0),
    };
  }, [rows]);

  const onUnlock = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    try {
      const res = await fetch("/api/rsvp-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError("Sai mật khẩu.");
        return;
      }
      if (!res.ok) {
        setError("Chưa kết nối được. Kiểm tra biến môi trường Supabase.");
        return;
      }
      const data = (await res.json()) as { rows: RsvpRow[] };
      setRows(data.rows);
    } catch {
      setError("Không tải được danh sách.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="paper min-h-dvh px-5 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-sans text-[11px] tracking-[0.38em] text-gold-deep uppercase">
          Chỉ cho hai bạn
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Xác nhận khách mời</h1>

        {rows === null ? (
          <form className="mt-12 max-w-sm space-y-6" onSubmit={onUnlock}>
            <div>
              <label htmlFor="password" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="field-input"
                aria-invalid={Boolean(error)}
              />
            </div>
            {error ? <p className="text-sm text-burgundy">{error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="cursor-pointer rounded-full bg-ink px-8 py-3 font-sans text-[11px] tracking-[0.28em] text-ivory uppercase disabled:opacity-50"
            >
              {pending ? "Đang mở…" : "Xem danh sách"}
            </button>
          </form>
        ) : (
          <>
            <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <dt className="font-sans text-[10px] tracking-[0.22em] text-muted uppercase">Lời trả lời</dt>
                <dd className="mt-1 font-serif text-3xl text-gold-deep">{stats?.replies}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] tracking-[0.22em] text-muted uppercase">Sẽ đến</dt>
                <dd className="mt-1 font-serif text-3xl text-gold-deep">{stats?.coming}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] tracking-[0.22em] text-muted uppercase">Không đến</dt>
                <dd className="mt-1 font-serif text-3xl text-gold-deep">{stats?.declined}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] tracking-[0.22em] text-muted uppercase">Số ghế</dt>
                <dd className="mt-1 font-serif text-3xl text-gold-deep">{stats?.seats}</dd>
              </div>
            </dl>

            {rows.length === 0 ? (
              <p className="mt-14 text-lg text-muted italic">Chưa có ai xác nhận.</p>
            ) : (
              <ul className="mt-14 space-y-8">
                {rows.map((row) => (
                  <li key={row.id} className="border-t border-ink/10 pt-6">
                    <p className="font-serif text-2xl">{row.name}</p>
                    <p className="mt-1 font-sans text-[11px] tracking-[0.18em] text-gold-deep uppercase">
                      {row.attendance === "yes" ? `Sẽ đến · ${row.guests} người` : "Không đến"}
                    </p>
                    {row.message ? <p className="mt-3 text-ink-soft italic">{row.message}</p> : null}
                    <p className="mt-2 text-sm text-muted">{formatWhen(row.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
