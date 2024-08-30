import express from "express";
// Controllers
import { upload } from "./controllers/upload";
import { confirm } from "./controllers/confirm";
import { list } from "./controllers/list";

// Variável de Rota
const router = express.Router();

// Rotas Disponíveis
router.post("/upload", upload);
router.patch("/confirm", confirm);
router.get("/:customer_code/list", list);

export default (): express.Router => {
  return router;
};
