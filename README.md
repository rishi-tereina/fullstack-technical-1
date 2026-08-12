# Business Details — onboarding form

A slice of a KYB (Know Your Business) onboarding flow. A prospective customer enters their
business details; we validate them and submit them to the platform.

Today the form supports **United States** businesses only.

## Quick start

```bash
npm install
npm start          # → http://localhost:5173
```

That's it. Everything runs offline after `npm install`; there's no backend to start, no `.env`
to fill in, and no services to connect.

```bash
npm run verify     # typecheck + tests in one go — 17 tests, all green on a fresh clone
npm test           # tests only (npm run test:watch to keep them running)
```

Node 20 or newer (`.nvmrc` pins v24.12.0 if you use nvm). `npm run dev` is an alias for
`npm start` if that's your habit.

## What's here

```
src/
  constants/
    business.ts          entity types, EIN + ZIP patterns, field length caps
    countries.ts         the supported-country list and its derived type
    usStates.ts          the 50-state option list
  messages/
    validationMessages.ts  user-facing validation copy (stands in for i18n)
  schemas/
    businessForm.ts      buildZBusinessForm(messages) — the validation source of truth
    addressForm.ts       shared address rules, reused by any form that needs an address
  components/form/
    Field.tsx            text input bound to react-hook-form
    SelectField.tsx      select bound to react-hook-form
  hooks/
    useBusinessForm.ts   form orchestration: useForm + zodResolver + useMutation
  pages/
    BusinessDetailsForm.tsx   the rendered form
  services/
    businessService.ts   mock submit
```

### Conventions worth knowing

These mirror how the real codebase is written — follow them or use your own, either is fine:

- **Zod owns validation.** Schemas are built by a `buildZ<Name>Form(messages)` factory that takes
  already-translated strings, so no user-facing copy is hardcoded in a schema. There is no second
  hand-written validator.
- **react-hook-form owns form state.** No `useState` for field values or errors.
- **React Query owns server state.** `handleSubmit` wraps the mutation, so the mutation only fires
  with validated values.
- **Inputs bind through the wrappers.** Call sites pass `name` + `control`; they never touch
  `useController`, `<Controller>`, `register`, or `setValue` directly.
- **`z.input` vs `z.output`.** An unselected dropdown is `''` in the input type and is narrowed to
  the enum by a transform at submit time, so nothing needs a cast.

## Your task

**Add support for Mexico and Germany.**

The three jurisdictions collect overlapping but different information:

| | 🇺🇸 United States | 🇲🇽 Mexico | 🇩🇪 Germany |
|---|---|---|---|
| Legal business name | required | required | required |
| Entity type | LLC · C-Corp · S-Corp · Partnership | S.A. de C.V. · S. de R.L. · S.A.P.I. | GmbH · UG · AG · GbR |
| Date of incorporation | required | required | required |
| **Tax ID** | **EIN** — `12-3456789` | **RFC** — 12 chars, `AAA######AAA` | **USt-IdNr** — `DE` + 9 digits |
| **Registration number** | *not collected* | **Folio Mercantil** — required | **Handelsregisternummer** — required |
| **Registry court** | *not collected* | *not collected* | **Registergericht** — required, dropdown |
| Street address | required | required | required |
| City | required | required | required |
| **State / province** | required — 50 states<br>labelled "State" | required — 32 states<br>labelled "Estado" | **not collected at all** |
| Postal code | 5 digits | 5 digits | 5 digits |
| **Address field order** | street → city → state → postal | street → city → state → postal | street → **postal → city** |

A short list of German registry courts, if you want one:
`Amtsgericht Charlottenburg`, `Amtsgericht München`, `Amtsgericht Hamburg`,
`Amtsgericht Frankfurt am Main`, `Amtsgericht Köln`, `Amtsgericht Stuttgart`.

Mexican states, if you want them, are fine to stub with three or four entries — a complete list
isn't the point of the exercise.

### How this is assessed

**You are not expected to finish.** Scope is deliberately larger than the time allows.

What's being assessed is how you structure the change and why — so please **talk through your
approach before you start typing**, and keep narrating as you go. A well-reasoned partial
implementation beats a complete one you can't defend.

Two questions worth having an answer to:

1. What does adding the *fourth* country cost, in your design?
2. What happens to data the user has already entered when they change the country?

You may add, move, rename, or delete anything in `src/`. Keeping the existing tests passing is
good, but changing them is fine if you explain why.
