export function calculaHistsAndErrorsByScoreChange(
  previousScore: number,
  newScore: number
): { hits: number; errors: number } {
  let hits = 0;
  let errors = 0;

  if (newScore > previousScore) {
    hits = 1;
  } else if (newScore < previousScore) {
    errors = 1;
  }

  return { hits, errors };
}
