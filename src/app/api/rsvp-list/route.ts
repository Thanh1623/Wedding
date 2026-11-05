import { NextResponse } from "next/server";
import { supabaseAdmin, type RsvpRow } from "@/lib/supabase";

export async function POST(request: Request) {
  const expected = process.env.RSVP_ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const password = String((body as { password?: unknown }).password ?? "");
  if (password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { data, error } = await db
    .from("rsvps")
    .select("id, name, attendance, guests, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("rsvp list", error.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, rows: (data ?? []) as RsvpRow[] });
}
