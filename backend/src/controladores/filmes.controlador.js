import bancoDeDados from "../bancoDeDados.js";

export const buscarFilmes = (req, res) => {
  const { nome } = req.query;

  try {
    if (nome) {
      const filmesFiltrados = bancoDeDados.filmes.filter((filme) => {
        return filme.original_title.toUpperCase().includes(nome.toUpperCase());
      });
      return res.status(200).json(filmesFiltrados);
    }

    const filmesCadastrados = bancoDeDados.filmes;

    return res.status(200).json(filmesCadastrados);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
};

export const buscarFilme = (req, res) => {
  const { id } = req.param;
  try {
    const filmeCadastrado = bancoDeDados.filmes.find(
      (filme) => filme.id === Number(id)
    );
    return res.status(200).json(filmeCadastrado);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
};
