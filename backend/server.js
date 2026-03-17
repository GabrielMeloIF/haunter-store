import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import produtoRoutes from "./src/routes/produtoRoutes.js";

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(categoriaRoutes);
app.use(produtoRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

app.get("/", (req, res) => {
  res.send("API rodando");
});