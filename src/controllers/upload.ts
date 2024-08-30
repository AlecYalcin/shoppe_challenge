import express from "express";
import prismaClient from "../prisma/prisma";
import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { convertImageToBase64, convertBase64toImage, getPath } from "../utils";

// Configuração do Env
dotenv.config();

export async function upload(req: express.Request, res: express.Response) {
  try {
    // Coletando informações do usuário
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Validação de dados
    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Dados fornecidos são inválidos.",
      });
    }

    // Google Gemini
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({
        error_code: "SERVER_INTERNAL_ERROR",
        error_description:
          "Houve algum problema ao requisitar a chave de acesso do Google Gemini.",
      });
    }

    convertImageToBase64(
      "/home/alec/Codigos/Projetos/shoppe_challenge/src/test1.jpeg"
    ).then((base65) => {
      if (base65) {
        const test = Buffer.from(base65, "base64");
        convertBase64toImage(base65);
      }
    });

    const fileManager = new GoogleAIFileManager(API_KEY);
    const uploadResult = await fileManager.uploadFile(getPath("temp.jpg"), {
      mimeType: "image/jpeg",
      displayName: "Conta de Água",
    });

    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Que imagem é essa? Você pode ver o quanto que é preciso pagar?",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    console.log(result.response.text());

    // Verificação de dados

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
