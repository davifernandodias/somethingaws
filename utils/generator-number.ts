export function generatorNumber(min: number, max: number, arrayIds: number[] = []): number {
  
  const totalPossibilities = max - min + 1;

  const blocked = arrayIds.filter(
    id => id >= min && id <= max
  ).length;

  if (blocked >= totalPossibilities) {
    throw new Error('Não existem números disponíveis para gerar dentro do intervalo informado.');
  }

  let random: number;

  do {
    random = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (arrayIds.includes(random));

  return random;
}
