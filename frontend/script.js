const divTost = document.querySelector("#toast");
const form = document.querySelector("#formulario");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");

const mostrarToast = (texto) => {
  const paragrafo = document.createElement("p");
  paragrafo.textContent = texto;

  divTost.appendChild(paragrafo);

  divTost.classList.remove("esconder");

  setTimeout(() => {
    divTost.classList.add("esconder");
    divTost.textContent = "";
  }, 2000);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const emailDigitado = email.value;
  const senhaDigitada = senha.value;

  const corpoRequisicao = {
    email: emailDigitado,
    senha: senhaDigitada,
  };

  try {
    const resposta = await axios.post(
      "http://localhost:3000/login",
      corpoRequisicao
    );

    const token = resposta.data.token;

    localStorage.setItem("token", token);

    window.location.href = "/frontend/pages/home/index.html";
  } catch (error) {
    if (!error.response.data.mensagem) {
      mostrarToast("Erro. Tente mais tarde");
      return;
    }

    mostrarToast(error.response.data.mensagem);
  }
});
