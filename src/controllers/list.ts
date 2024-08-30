import express from "express";
import prismaClient from "../prisma/prisma";
import { Type } from "@prisma/client";

export async function list(req: express.Request, res: express.Response) {
  try {
    let result = [];

    // Verificando se há query
    const query = req.query;
    if (Object.keys(query).length != 0) {
      // Verificando se a query possui os parâmetoros certos
      if (
        query.measure_type &&
        query.measure_type != "WATER" &&
        query.measure_type != "GAS"
      ) {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        });
      } else {
        // Identificando o time de enum
        const identify_type = Type[query.measure_type as keyof typeof Type];
        // Carregando resultado com query
        result = await prismaClient.measure.findMany({
          where: {
            customer_code: req.params.customer_code,
            measure_type: identify_type,
          },
        });
      }
    } else {
      // Carregando resultado sem query
      result = await prismaClient.measure.findMany({
        where: {
          customer_code: req.params.customer_code,
        },
      });
    }

    // Erro 404
    if (Object.keys(result).length == 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });
    }

    // Formatando a resposta para o usuário
    const formattedResult = result.map(({ customer_code, ...rest }) => rest);
    const jsonResult = {
      customer_code: req.params.customer_code,
      measures: formattedResult,
    };

    return res.status(200).json({ jsonResult });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
