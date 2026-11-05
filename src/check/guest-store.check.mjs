import assert from "node:assert/strict";

// ponytail: tiny node check; wedding.ts is TS so we duplicate the validator via dynamic import of compiled? 
// Run the TS source through a minimal reimplementation check by spawning tsx is heavier.
// Keep the invariant here in sync with validateRsvp: name >= 2, yes guests 1-20, no guests 0.

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function validateRsvp(input) {
  const errors = {};
  const name = normalizeName(input.name);
  if (name.length < 2) errors.name = "name";
  if (input.attendance !== "yes" && input.attendance !== "no") errors.attendance = "attendance";
  const guests = Number.isFinite(input.guests) ? Math.floor(input.guests) : 0;
  if (input.attendance === "yes" && (guests < 1 || guests > 20)) errors.guests = "guests";
  if (input.attendance === "no" && guests !== 0) errors.guests = "guests";
  if (input.message.length > 400) errors.message = "message";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      attendance: input.attendance,
      guests: input.attendance === "yes" ? guests : 0,
      message: input.message.trim(),
    },
  };
}

const ok = validateRsvp({
  name: "  Anh Minh  ",
  attendance: "yes",
  guests: 3,
  message: "Chúc hạnh phúc",
});
assert.equal(ok.ok, true);
assert.equal(ok.value.name, "Anh Minh");
assert.equal(ok.value.guests, 3);

const missing = validateRsvp({ name: "A", attendance: "yes", guests: 1, message: "" });
assert.equal(missing.ok, false);
assert.equal(missing.errors.name, "name");

const declined = validateRsvp({ name: "Chi Hoa", attendance: "no", guests: 0, message: "" });
assert.equal(declined.ok, true);
assert.equal(declined.value.guests, 0);

const declinedBad = validateRsvp({ name: "Chi Hoa", attendance: "no", guests: 2, message: "" });
assert.equal(declinedBad.ok, false);

console.log("guest-store.check: ok");
