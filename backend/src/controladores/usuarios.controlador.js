import jwt from "jsonwebtoken";
import bancoDeDados from "../bancoDeDados.js";
import { senhaJwt } from "../dadosSensiveis.js";

export const logarUsuario = (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Todos os dados são obrigatórios" });
    }

    const usuarioCadastrado = bancoDeDados.usuarios.find(
      (usuario) => usuario.email === email
    );

    if (!usuarioCadastrado) {
      return res.status(400).json({ mensagem: "Email ou senha inválidos" });
    }

    if (usuarioCadastrado.senha !== senha) {
      return res.status(400).json({ mensagem: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: usuarioCadastrado.id }, senhaJwt, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
};
