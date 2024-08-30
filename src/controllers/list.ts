import express from "express";

export async function list(req: express.Request, res: express.Response) {
  try {
    console.log("Listing...");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
