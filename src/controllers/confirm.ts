import express from "express";
import prismaClient from "../prisma/prisma";

export async function confirm(req: express.Request, res: express.Response) {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Erro 400
    if (!measure_uuid || !confirmed_value) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Um ou mais dados fornecidos não são válidos.",
      });
    }

    // Encontrando leitura
    const result = await prismaClient.measure.findFirst({
      where: {
        measure_uuid: measure_uuid,
      },
    });

    // Erro 404
    if (!result) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês não encontrada.",
      });
    }

    // Erro 409
    if (result.status == "CONFIRMED") {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada.",
      });
    }

    // Alterando leitura
    await prismaClient.measure.update({
      where: {
        measure_uuid: measure_uuid,
      },
      data: {
        measure_value: confirmed_value,
        status: "CONFIRMED",
      },
    });

    return res.status(200).json({ sucess: true });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
}
