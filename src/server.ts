import express from "express";
import bodyParser from "body-parser";
import router from "./routes";

// Servidor Express
const app = express();

// Configuração de Roteamento
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use("/", router());

// Porta e Inicialização
app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080/");
});
