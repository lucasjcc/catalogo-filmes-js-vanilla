const body = document.querySelector("body");
const divContainerFilmes = document.querySelector("#container-filmes");
const inputPesquisar = document.querySelector("#pesquisar");
const setaDireita = document.querySelector("#seta-direita");
const setaEsqueda = document.querySelector("#seta-esquerda");

let paginaAtual = 1;
let quantidadeFilmesMostados = 5;
let quantidadeFilmes = undefined;
let filmesEncontrados = [];
let temaAtual = "claro";

inputPesquisar.addEventListener("input", (e) => {
  if (filmesEncontrados.length === 0) {
    return;
  }

  const filtro = e.target.value;
  const filmesFiltrados = filmesEncontrados.filter((filme) => {
    const nomeFilme = filme.original_title;
    if (nomeFilme.toUpperCase().includes(filtro.toUpperCase())) {
      return filme;
    }
  });

  mostrarFilmes(filmesFiltrados);
});

setaDireita.addEventListener("click", () => {
  if (!quantidadeFilmes) return;
  const quantidadePaginas = Math.floor(
    quantidadeFilmes / quantidadeFilmesMostados
  );

  if (paginaAtual >= quantidadePaginas) {
    paginaAtual = 1;
    mostrarFilmes(filmesEncontrados);
    return;
  }

  paginaAtual++;
  mostrarFilmes(filmesEncontrados);
  return;
});

setaEsqueda.addEventListener("click", () => {
  if (!quantidadeFilmes) return;
  const quantidadePaginas = Math.floor(
    quantidadeFilmes / quantidadeFilmesMostados
  );

  if (paginaAtual <= 1) {
    paginaAtual = quantidadePaginas;
    mostrarFilmes(filmesEncontrados);
    return;
  }

  paginaAtual--;
  mostrarFilmes(filmesEncontrados);
  return;
});

const mudarTema = document.querySelector("#tema");
mudarTema.addEventListener("click", () => {
  temaAtual = temaAtual === "claro" ? "escuro" : "claro";

  if (temaAtual === "claro") {
    body.classList.remove("tema-escuro");
    inputPesquisar.classList.remove("tema-escuro");
    setaEsqueda.src = "../../assets/seta-esquerda-preta.svg";
    setaDireita.src = "../../assets/seta-direita-preta.svg";
    mudarTema.src = "../../assets/dark-mode.svg";
    return;
  }

  body.classList.add("tema-escuro");
  inputPesquisar.classList.add("tema-escuro");
  setaEsqueda.src = "../../assets/seta-esquerda-branca.svg";
  setaDireita.src = "../../assets/seta-direita-branca.svg";

  mudarTema.src = "../../assets/light-mode.svg";
  return;
});

function exibirToast(mensagem) {
  const paragrafoMensagem = document.querySelector(".toast__mensagem");
  paragrafoMensagem.textContent = mensagem;

  const toast = document.querySelector(".toast");
  toast.classList.add("toast--falha");
  toast.classList.remove("esconder");
  setTimeout(() => {
    toast.classList.remove("toast--falha");
    toast.classList.add("esconder");
  }, 2000);
}

function criarFilme(nome, imagemFilme, notaFilme) {
  const articleFilme = document.createElement("article");
  articleFilme.classList.add("filme");
  articleFilme.style.backgroundImage = `url(${imagemFilme})`;

  const divContainerInfo = document.createElement("div");
  divContainerInfo.classList.add("filme__container-info");

  const paragrafoNomeFilme = document.createElement("p");
  paragrafoNomeFilme.classList.add("filme__nome");
  paragrafoNomeFilme.textContent = nome;

  const divContainerNota = document.createElement("div");
  divContainerNota.classList.add("container-info__container-nota");

  const img = document.createElement("img");
  img.classList.add("container-nota__img");
  img.src = "../../assets/estrela.svg";

  const paragrafoNota = document.createElement("p");
  paragrafoNota.classList.add("container-nota__nota");
  paragrafoNota.textContent = notaFilme;

  divContainerNota.append(img, paragrafoNota);

  divContainerInfo.append(paragrafoNomeFilme, divContainerNota);

  articleFilme.append(divContainerInfo);

  divContainerFilmes.appendChild(articleFilme);
}

function mostrarFilmes(filmes) {
  divContainerFilmes.textContent = "";

  if (filmes.length === 0) {
    return;
  }

  const indexPrimeiroFilmeMostrado =
    (paginaAtual - 1) * quantidadeFilmesMostados;

  quantidadeFilmes = filmes.length;

  const indexUltimoFilmeMostrado =
    quantidadeFilmes < quantidadeFilmesMostados
      ? quantidadeFilmes
      : indexPrimeiroFilmeMostrado + quantidadeFilmesMostados;

  for (let i = indexPrimeiroFilmeMostrado; i < indexUltimoFilmeMostrado; i++) {
    const nomeFilme = filmes[i].original_title;
    const imagemFilme = filmes[i].poster_path;
    const notaFilme = filmes[i].vote_average;
    criarFilme(nomeFilme, imagemFilme, notaFilme);
  }
}

async function buscarFilmes() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/frontend";
    }

    const respostaRequisicao = await fetch("http://localhost:3000/filmes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (respostaRequisicao.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/frontend";
      return;
    }

    filmesEncontrados = await respostaRequisicao.json();

    mostrarFilmes(filmesEncontrados);
    return;
  } catch (error) {
    exibirToast("Ocorreu um erro. Tente mais tarde!");
    return;
  }
}

buscarFilmes();
