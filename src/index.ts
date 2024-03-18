type Severity = 0 | 1 | 2;
type SeverityString = 'error' | 'off' | 'warn';
type RuleLevel = Severity | SeverityString;
type RuleLevelAndOptions = [RuleLevel, ...unknown[]];
type RuleEntry = RuleLevel | RuleLevelAndOptions;
type RulesRecord = Partial<Record<string, RuleEntry>>;

export type RuleMapCallbackFn = (ruleKey: string, ruleEntry: RuleEntry | undefined) => RuleEntry | undefined;

/**
 * Map ESLint rules using the provided mapper
 *
 * @param rules - The rules to map
 * @param callbackFn - Called for each with each entry in the rules record
 * 
 * @returns A new rules record with the mapped values
 */
export default function mapRules(
  rules: RulesRecord | undefined,
  callbackFn: RuleMapCallbackFn,
): RulesRecord | undefined {
  if (!rules) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      if (typeof callbackFn === 'function') {
        return [key, callbackFn(key, value)];
      }
      return [key, callbackFn];
    }),
  );
}

/**
 * Changes the severity of a rule from `"error"` or `2` to `"warn"`. Other severities are left unchanged.
 */
export const errorToWarn: RuleMapCallbackFn = (_, ruleEntry) => {
  if (typeof ruleEntry === 'string' || typeof ruleEntry === 'number') {
    const severity = ruleEntry
    if (severity === 'off' || severity === 0) {
      return ruleEntry;
    } else if (severity === 'warn' || severity === 1) {
      return ruleEntry;
    } else if (severity === 'error' || severity === 2) {
      return 'warn';
    }
  } else if (Array.isArray(ruleEntry)) {
    const [severity, ...options] = ruleEntry;
    if (severity === 'off' || severity === 0) {
      return ruleEntry;
    } else if (severity === 'warn' || severity === 1) {
      return ruleEntry;
    } else if (severity === 'error' || severity === 2) {
      return ['warn', ...options];
    }
  }

  return ruleEntry;
};

/**
 * Changes a severity of a rule from `0`, `1`, or `2` to `"off"`, `"warn"`, or `"error"` respectively.
 */
export const verboseSeverity: RuleMapCallbackFn = (_, ruleEntry) => {
    if (typeof ruleEntry === 'string' || typeof ruleEntry === 'number') {
    const severity = ruleEntry;
    if (severity === 'off' || severity === 0) {
      return 'off';
    } else if (severity === 'warn' || severity === 1) {
      return 'warn';
    } else if (severity === 'error' || severity === 2) {
      return 'error';
    }
  } else if (Array.isArray(ruleEntry)) {
    const [severity, ...options] = ruleEntry;
    if (severity === 'off' || severity === 0) {
      return ['off', ...options];
    } else if (severity === 'warn' || severity === 1) {
      return ['warn', ...options];
    } else if (severity === 'error' || severity === 2) {
      return ['error', ...options];
    }
  }

  return ruleEntry;
}