import { NextResponse } from "next/server";
import { validateRsvp } from "@/lib/guest-store";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
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

  const input = (body ?? {}) as Record<string, unknown>;
  const result = validateRsvp({
    name: String(input.name ?? ""),
    attendance: String(input.attendance ?? ""),
    guests: Number(input.guests ?? 0),
    message: String(input.message ?? ""),
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { error } = await db.from("rsvps").insert({
    name: result.value.name,
    attendance: result.value.attendance,
    guests: result.value.guests,
    message: result.value.message,
  });
  if (error) {
    console.error("rsvp insert", error.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
