import { Router } from "express";
import { listarProdutos, buscarProduto } from "../controllers/produtoController.js";

const router = Router();

router.get("/produtos", listarProdutos);
router.get("/produtos/:id", buscarProduto);

export default router;