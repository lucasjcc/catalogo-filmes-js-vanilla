const body = document.querySelector("body");
const divContainerFilmes = document.querySelector("#container-filmes");
const inputPesquisar = document.querySelector("#pesquisar");

let paginaAtual = 1;
let quantidadeFilmesMostados = 5;
let quantidadeFilmes = undefined;
let filmesEncontrados = [];
let temaAtual = "claro";

const setaDireita = document.querySelector("#seta-direita");
setaDireita.addEventListener("click", () => {
  if (!quantidadeFilmes) return;
  const quantidadePaginas = Math.floor(
    quantidadeFilmes / quantidadeFilmesMostados
  );

  if (paginaAtual >= quantidadePaginas) {
    paginaAtual = 1;
    mostrarFilmes();
    return;
  }

  paginaAtual++;
  mostrarFilmes();
  return;
});

const setaEsqueda = document.querySelector("#seta-esquerda");
setaEsqueda.addEventListener("click", () => {
  if (!quantidadeFilmes) return;
  const quantidadePaginas = Math.floor(
    quantidadeFilmes / quantidadeFilmesMostados
  );

  if (paginaAtual <= 1) {
    paginaAtual = quantidadePaginas;
    mostrarFilmes();
    return;
  }

  paginaAtual--;
  mostrarFilmes();
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
  console.log(imagemFilme);

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

function mostrarFilmes() {
  const indexPrimeiroFilmeMostrado =
    (paginaAtual - 1) * quantidadeFilmesMostados;
  const indexUltimoFilmeMostrado =
    indexPrimeiroFilmeMostrado + quantidadeFilmesMostados;
  quantidadeFilmes = filmesEncontrados.length;

  divContainerFilmes.textContent = "";
  for (let i = indexPrimeiroFilmeMostrado; i < indexUltimoFilmeMostrado; i++) {
    const nomeFilme = filmesEncontrados[i].original_title;
    const imagemFilme = filmesEncontrados[i].poster_path;
    const notaFilme = filmesEncontrados[i].vote_average;
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

    mostrarFilmes();
    return;
  } catch (error) {
    exibirToast("Ocorreu um erro. Tente mais tarde!");
    return;
  }
}

buscarFilmes();
