import { Router } from "express";
import { logarUsuario } from "./controladores/usuarios.controlador.js";
import {
  buscarFilme,
  buscarFilmes,
} from "./controladores/filmes.controlador.js";
import { validarAutenticacao } from "./intermediarios/autenticacao.intermediario.js";
const rotas = Router();

rotas.post("/login", logarUsuario);

rotas.use(validarAutenticacao);

rotas.get("/filmes", buscarFilmes);

rotas.get("/filmes/:id", buscarFilme);

export default rotas;
