import jwt from "jsonwebtoken";
import { senhaJwt } from "../dadosSensiveis.js";

export const validarAutenticacao = (req, res, next) => {
  const autorization = req.headers["authorization"];

  if (!autorization) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = autorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const payload = jwt.verify(token, senhaJwt);
    req.idUsuario = payload;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ mensagem: "Token inválido ou expirado" });
  }
};
