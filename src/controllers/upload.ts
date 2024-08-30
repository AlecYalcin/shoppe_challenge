import express from "express";
import prismaClient from "../prisma/prisma";
import { getMonthlyMeasure } from "../prisma/prisma";
import dotenv from "dotenv";

import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import {
  convertBase64toImage,
  isDateTime,
  isMeasureType,
  getPath,
} from "../utils";

// Configuração do Env
dotenv.config();

export async function upload(req: express.Request, res: express.Response) {
  try {
    // Coletando informações do usuário
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Erro 400 - Dados Inválidos
    if (
      !image ||
      !customer_code ||
      !isDateTime(measure_datetime) ||
      !isMeasureType(measure_type)
    ) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Dados fornecidos são inválidos.",
      });
    }

    // Erro 409 - Leitura do Mês já Realizada
    getMonthlyMeasure(measure_datetime, measure_type).then((result) => {
      console.log(result);
      if (result) {
        return res.status(409).json({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      }
    });

    // Erro 500 - Erro interno do Sistema
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error_code: "SERVER_INTERNAL_ERROR",
        error_description:
          "Houve algum problema ao requisitar a chave de acesso do Google Gemini.",
      });
    }

    // Transformando o Base64 em uma Imagem Temporária
    convertBase64toImage(image);

    // Processando dados da Imagem através do Google Gemini
    const fileManager = new GoogleAIFileManager(API_KEY);
    const uploadResult = await fileManager.uploadFile(
      getPath("temp/temp.jpg"),
      {
        mimeType: "image/jpeg",
        displayName: "Conta de Água",
      }
    );

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt de Comando
    const result = await model.generateContent([
      "Retorne o total a pagar dessa conta somente em números",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const image_url: string = `${uploadResult.file.uri}?key=${API_KEY}`;
    const measure_value: number = +result.response.text();
    const measure_uuid: string = uuidv4();

    const data = {
      image_url: image_url,
      measure_value: measure_value,
      measure_uuid: measure_uuid,
    };

    // Salvando no Banco de Dados
    await prismaClient.measure.create({
      data: {
        measure_uuid: measure_uuid,
        customer_code: customer_code,
        measure_datetime: measure_datetime,
        measure_type: measure_type,
        image_url: image_url,
        measure_value: measure_value,
      },
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
