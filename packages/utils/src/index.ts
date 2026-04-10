/**
 * Exhaustiveness helper for discriminated unions and switch statements.
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
