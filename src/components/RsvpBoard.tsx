"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { type WeddingCopy } from "@/data/wedding";
import { loadRsvp, saveRsvp, validateRsvp, type RsvpRecord } from "@/lib/guest-store";

type Props = {
  copy: WeddingCopy;
  guestName: string;
};

const errorCopy = {
  name: (c: WeddingCopy) => c.fieldRequired,
  attendance: (c: WeddingCopy) => c.fieldRequired,
  guests: (c: WeddingCopy) => c.guestsHint,
  message: (c: WeddingCopy) => c.fieldRequired,
};

export function RsvpBoard({ copy, guestName }: Props) {
  const [rsvp, setRsvp] = useState<RsvpRecord | null>(null);
  const [rsvpErrors, setRsvpErrors] = useState<Record<string, string>>({});
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    setRsvp(loadRsvp());
  }, []);

  const onRsvp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = validateRsvp({
      name: String(form.get("name") ?? ""),
      attendance: String(form.get("attendance") ?? ""),
      guests: Number(form.get("guests") ?? 0),
      message: String(form.get("message") ?? ""),
    });
    if (!result.ok) {
      setRsvpErrors(result.errors);
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setSending(true);
    setSendError(false);
    setRsvpErrors({});
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.value),
      });
      if (!res.ok) {
        setSendError(true);
        return;
      }
      const record: RsvpRecord = { ...result.value, at: new Date().toISOString() };
      saveRsvp(record);
      setRsvp(record);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="rsvp"
      data-scene
      className="paper snap-scene relative flex min-h-dvh items-center overflow-hidden px-5 py-16 md:px-10"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="scene-text text-center lg:text-left">
          <p className="font-sans text-xs tracking-[0.38em] text-gold-deep uppercase">
            {copy.rsvpEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ink md:text-6xl">{copy.rsvpTitle}</h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-ink-soft md:text-lg lg:mx-0">
            {copy.rsvpBody}
          </p>
        </div>

        <div
          data-reveal
          className="rounded-2xl border border-gold/35 bg-white/85 p-6 shadow-[0_24px_60px_rgba(42,18,24,0.08)] backdrop-blur-sm md:p-8"
        >
          {rsvp ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle size={44} weight="light" className="text-gold-deep" aria-hidden="true" />
              <p className="font-serif text-2xl text-ink italic">{copy.rsvpSaved}</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onRsvp} noValidate>
              <div>
                <label htmlFor="name" className="font-sans text-[11px] tracking-[0.22em] text-gold-deep uppercase">
                  {copy.rsvpName}
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={guestName}
                  className="field-light"
                  autoComplete="name"
                  aria-invalid={Boolean(rsvpErrors.name)}
                />
                {rsvpErrors.name ? (
                  <p className="mt-1 text-sm text-burgundy">{errorCopy.name(copy)}</p>
                ) : null}
              </div>

              <fieldset>
                <legend className="font-sans text-[11px] tracking-[0.22em] text-gold-deep uppercase">{copy.rsvpAttendance}</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(["yes", "no"] as const).map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/30 bg-white/60 px-4 py-3 text-ink transition-colors has-checked:border-gold-deep has-checked:bg-gold/10"
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={attendance === value}
                        onChange={() => setAttendance(value)}
                        className="accent-gold-deep"
                      />
                      {value === "yes" ? copy.rsvpYes : copy.rsvpNo}
                    </label>
                  ))}
                </div>
              </fieldset>

              {attendance === "yes" ? (
                <div>
                  <label htmlFor="guests" className="font-sans text-[11px] tracking-[0.22em] text-gold-deep uppercase">
                    {copy.rsvpGuests}
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={1}
                    className="field-light"
                    aria-invalid={Boolean(rsvpErrors.guests)}
                    aria-describedby="guests-hint"
                  />
                  <p id="guests-hint" className="mt-1 text-sm text-ink-soft">
                    {copy.guestsHint}
                  </p>
                </div>
              ) : (
                <input type="hidden" name="guests" value="0" />
              )}

              <div>
                <label htmlFor="message" className="font-sans text-[11px] tracking-[0.22em] text-gold-deep uppercase">
                  {copy.rsvpMessage}
                </label>
                <textarea id="message" name="message" rows={3} className="field-light resize-y" />
              </div>

              {sendError ? (
                <p className="text-sm text-burgundy" role="alert">
                  {copy.rsvpSendError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={sending}
                className="w-full cursor-pointer rounded-full bg-linear-to-b from-gold-bright to-gold px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.3em] text-night uppercase shadow-[0_10px_30px_rgba(202,138,4,0.3)] transition-[filter] duration-200 hover:brightness-110 disabled:opacity-60"
              >
                {sending ? copy.rsvpSending : copy.rsvpSubmit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
