import { z } from 'zod';

/**
 * A required string that is then format-checked — in that order, reporting one message.
 *
 * Chaining `.min(1, …).regex(…)` looks equivalent but is not: zod runs **every** check in a
 * chain rather than stopping at the first failure, so an empty value reports both "this is
 * required" *and* "this is the wrong format". react-hook-form's default `criteriaMode:
 * 'firstError'` hides the second one, so the bug is invisible until someone switches to
 * `criteriaMode: 'all'` (a common accessibility change) or reads `safeParse` issues directly.
 *
 * A `superRefine` with an early return reports exactly one message: the first that applies.
 */
export const requiredWithFormat = (
  pattern: RegExp,
  requiredMessage: string,
  formatMessage: string,
) =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: 'custom', message: requiredMessage });
        return;
      }
      if (!pattern.test(value)) {
        ctx.addIssue({ code: 'custom', message: formatMessage });
      }
    });
