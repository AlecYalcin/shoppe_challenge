import express from "express";

export async function confirm(req: express.Request, res: express.Response) {
  try {
    console.log("Confirming...");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
