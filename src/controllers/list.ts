import express from "express";
import prismaClient from "../prisma/prisma";
import { Type } from "@prisma/client";

export async function list(req: express.Request, res: express.Response) {
  try {
    let result = [];
    const query = req.query;

    // Verificando se há query
    if (Object.keys(query).length != 0) {
      // Verificando se a query possui os parâmetoros certos
      if (
        req.query.measure_type &&
        req.query.measure_type != "WATER" &&
        req.query.measure_type != "GAS"
      ) {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        });
      } else {
        const identify_type = Type[req.query.measure_type as keyof typeof Type];
        result = await prismaClient.measure.findMany({
          where: {
            customer_code: req.params.customer_code,
            measure_type: identify_type,
          },
        });
      }
    } else {
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
