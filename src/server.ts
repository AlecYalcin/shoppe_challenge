import express from "express";
import router from "./routes";

// Servidor Express
const app = express();

// Configuração de Roteamento
app.use(express.json());
app.use("/", router());

// Porta e Inicialização
app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080/");
});
