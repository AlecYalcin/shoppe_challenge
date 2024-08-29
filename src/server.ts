import express from "express";

// Servidor Express
const app = express();

// Porta e Inicialização
app.listen(8000, () => {
  console.log("Servidor rodando em http://localhost:8000/");
});
