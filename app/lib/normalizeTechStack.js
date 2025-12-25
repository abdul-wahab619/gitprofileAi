export function normalizeTechStack(stack, minPercent = 1) {
  // total raw percentage sum
  const total = Object.values(stack).reduce((a, b) => a + b, 0);

  let normalized = {};
  let others = 0;

  for (const [tech, value] of Object.entries(stack)) {
    const percent = (value / total) * 100;

    if (percent < minPercent) {
      others += percent;
    } else {
      normalized[tech] = percent;
    }
  }

  if (others > 0) {
    normalized["Others"] = others;
  }

  // Final rounding + re-normalize to EXACT 100
  const finalTotal = Object.values(normalized).reduce((a, b) => a + b, 0);

  const result = {};
  for (const [k, v] of Object.entries(normalized)) {
    result[k] = Number(((v / finalTotal) * 100).toFixed(2));
  }

  return result;
}
