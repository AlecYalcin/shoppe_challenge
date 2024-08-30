import { PrismaClient, Type } from "@prisma/client";

const prismaClient = new PrismaClient();

export default prismaClient;

// Encontrar leitura do mês
export async function getMonthlyMeasure(
  code: string,
  date: string,
  type: string
) {
  // Verifica se o tipo passado existe como Enum
  const identify_type = Type[type as keyof typeof Type];
  if (!identify_type) {
    return;
  }

  // Carregando a Data atual
  const inputDate = new Date(date);

  // Primeiro e Último dias do mês
  const firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
  const lastDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth() + 1,
    1
  );

  const result = prismaClient.measure.findFirst({
    where: {
      customer_code: code,
      measure_type: identify_type,
      measure_datetime: {
        gte: firstDay,
        lt: lastDay,
      },
    },
  });

  return result;
}
