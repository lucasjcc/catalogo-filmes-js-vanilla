import express from "express";
import cors from "cors";
import rotas from "./rotas.js";

const PORTA = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(PORTA, () => console.log(`API rodando na porta ${PORTA}`));
