export type Attendance = "yes" | "no";

export type RsvpRecord = {
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  at: string;
};

export const RSVP_KEY = "solenne-rsvp";

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateRsvp(input: {
  name: string;
  attendance: string;
  guests: number;
  message: string;
}): { ok: true; value: Omit<RsvpRecord, "at"> } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = normalizeName(input.name);
  if (name.length < 2) errors.name = "name";
  if (input.attendance !== "yes" && input.attendance !== "no") {
    errors.attendance = "attendance";
  }
  const guests = Number.isFinite(input.guests) ? Math.floor(input.guests) : 0;
  if (input.attendance === "yes" && (guests < 1 || guests > 20)) {
    errors.guests = "guests";
  }
  if (input.attendance === "no" && guests !== 0) {
    errors.guests = "guests";
  }
  if (input.message.length > 400) errors.message = "message";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      attendance: input.attendance as Attendance,
      guests: input.attendance === "yes" ? guests : 0,
      message: input.message.trim(),
    },
  };
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function saveRsvp(record: RsvpRecord) {
  writeJson(RSVP_KEY, record);
}

export function loadRsvp() {
  return readJson<RsvpRecord | null>(RSVP_KEY, null);
}
