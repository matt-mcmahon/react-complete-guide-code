interface Currency {
  isSafeInteger(): boolean;
  [Symbol.toPrimitive](hint: "number"): number;
  [Symbol.toPrimitive](hint: "string"): string;
  [Symbol.toPrimitive](hint: "default"): string;
}
type Widen<T> = T extends bigint ? bigint : T extends number ? number : never;

/**
 *
 * @param p 1/precision is the fractional portion for toString, etc.
 *                  Default's to 100 cents per dollar.
 * @param options defaults to USD, e.g. "$1,000.00"
 */
export function currency(
  precision?: number,
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  }
) {
  const n = new Intl.NumberFormat(undefined, options);
  const p = precision ?? 100;

  /**
   * @param dollars dollar amount with fraction as a number
   */
  function setter(dollars: number): Currency;

  /**
   * @param cents integer amount in cents, as a **BigInt** value, where there
   *              are *precision* cents per whole dollar; default 100¢ = $1
   */
  function setter(cents: bigint): Currency;

  /** Create a currency with the given value. */
  function setter(value: number | bigint): Currency {
    const x: bigint = typeof value === "bigint" ? value : BigInt(value * p);

    function toString(): string {
      return n.format(Number(x) / p);
    }

    function valueOf(): number {
      return Number(x) / p;
    }

    return Object.create({
      isSafeInteger() {
        return Number.isSafeInteger(x);
      },
      toString,
      valueOf,
      [Symbol.toPrimitive](hint: "number" | "string" | "default") {
        switch (hint) {
          case "number":
            return valueOf();
          case "string":
            return toString();
          case "default":
            return toString();
          default:
            ((hint: never) => {
              throw new TypeError(`expected 'never' not ${hint}`);
            })(hint);
        }
      },
    });
  }

  return Object.assign(setter, {
    get precision() {
      return Number(p);
    },
  });
}
