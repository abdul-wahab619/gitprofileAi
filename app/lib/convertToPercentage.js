// app/lib/convertToPercentage.js
export function convertToPercentage(techTotals) {
  const total = Object.values(techTotals).reduce((a, b) => a + b, 0);

  const result = {};
  for (const [tech, value] of Object.entries(techTotals)) {
    result[tech] = Number(((value / total) * 100).toFixed(2));
  }

  return result;
}
