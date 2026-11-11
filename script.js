const botaoAbrirFormulario = document.querySelector("#abrir-formulario");
const formularioDialogo = document.querySelector("#formulario-dialogo");
const botaoFecharFormulario = document.querySelector("#fechar-formulario");
const botaoInstalar = document.querySelector("#instalar-app");

let eventoInstalacaoPendente;

window.addEventListener("beforeinstallprompt", (evento) => {
  evento.preventDefault();
  eventoInstalacaoPendente = evento;
  botaoInstalar.hidden = false;
});

botaoInstalar.addEventListener("click", async () => {
  if (!eventoInstalacaoPendente) {
    return;
  }

  const evento = eventoInstalacaoPendente;
  eventoInstalacaoPendente = null;
  botaoInstalar.hidden = true;

  try {
    await evento.prompt();
    await evento.userChoice;
  } catch (erro) {
    console.error("Falha ao iniciar a instalação do app:", erro);
  }
});

window.addEventListener("appinstalled", () => {
  eventoInstalacaoPendente = null;
  botaoInstalar.hidden = true;
});

botaoAbrirFormulario.addEventListener("click", () => {
  formularioDialogo.showModal();
});

botaoFecharFormulario.addEventListener("click", () => {
  formularioDialogo.close();
});

const seletorDia = document.querySelector("#dia-registro");
const campoMes = document.querySelector("#mes-registro");
const campoAno = document.querySelector("#ano-registro");

const anoAtual = new Date().getFullYear();

for (let ano = anoAtual; ano >= anoAtual - 100; ano -= 1) {
  const opcaoAno = document.createElement("option");
  opcaoAno.value = ano;
  opcaoAno.textContent = ano;
  campoAno.append(opcaoAno);
}

function atualizarDiasDisponiveis() {
  const mes = Number(campoMes.value);
  const ano = Number(campoAno.value);

  if (!ano || !mes) {
    for (const opcao of seletorDia.options) {
      if (opcao.value !== "") {
        opcao.disabled = false;
        opcao.textContent = opcao.value;
      }
    }

    seletorDia.setCustomValidity("");
    return;
  }

  const quantidadeDias = new Date(ano, mes, 0).getDate();
  const diaEscolhido = Number(seletorDia.value);

  for (const opcao of seletorDia.options) {
    const dia = Number(opcao.value);

    if (opcao.value !== "") {
      const diaIndisponivel = dia > quantidadeDias;
      opcao.disabled = diaIndisponivel;
      opcao.textContent = diaIndisponivel ? `${dia} - x` : dia;
    }
  }

  if (diaEscolhido > quantidadeDias) {
    seletorDia.setCustomValidity(
      "Esse dia não existe no mês escolhido. Selecione outro dia ou escolha 'Sem dia'."
    );
  } else {
    seletorDia.setCustomValidity("");
  }
}

campoMes.addEventListener("change", atualizarDiasDisponiveis);
campoAno.addEventListener("change", atualizarDiasDisponiveis);
seletorDia.addEventListener("change", atualizarDiasDisponiveis);

const formularioRegistro = document.querySelector("#formulario-registro");
const campoTitulo = document.querySelector("#titulo-registro");
const campoDescricao = document.querySelector("#descricao");
const listaRegistros = document.querySelector("#registros-list");
const avisoListaVazia = document.querySelector("#estado-vazio");
const botaoOrdemRecentes = document.querySelector("#ordem-recentes");
const botaoOrdemAntigas = document.querySelector("#ordem-antigas");
const chaveArmazenamento = "diarioDeBordoRegistros";

let registros = [];
let ordemRegistros = "recentes";

try {
  const registrosSalvos = JSON.parse(localStorage.getItem(chaveArmazenamento) || "[]");

  if (Array.isArray(registrosSalvos)) {
    registros = registrosSalvos;
  }
} catch {
  registros = [];
}

function formatarDataRegistro(registro) {
  const opcoesData = registro.dia
    ? { day: "numeric", month: "long", year: "numeric" }
    : { month: "long", year: "numeric" };
  const dia = registro.dia || 1;
  const data = new Date(registro.ano, registro.mes - 1, dia);

  return new Intl.DateTimeFormat("pt-BR", opcoesData).format(data);
}

function removerRegistro(idRegistro) {
  registros = registros.filter((registro) => registro.id !== idRegistro);
  localStorage.setItem(chaveArmazenamento, JSON.stringify(registros));
  renderizarRegistros();
}

function renderizarRegistros() {
  listaRegistros.replaceChildren();
  avisoListaVazia.hidden = registros.length > 0;

  const registrosOrdenados = [...registros].sort((registroA, registroB) => {
    const dataA = new Date(registroA.ano, registroA.mes - 1, registroA.dia || 1);
    const dataB = new Date(registroB.ano, registroB.mes - 1, registroB.dia || 1);
    const diferencaDatas = dataB - dataA;

    return ordemRegistros === "recentes" ? diferencaDatas : -diferencaDatas;
  });

  for (const registro of registrosOrdenados) {
    const cartao = document.createElement("li");
    const titulo = document.createElement("h3");
    const data = document.createElement("p");
    const descricao = document.createElement("p");
    const botaoRemover = document.createElement("button");

    titulo.textContent = registro.titulo;
    data.textContent = formatarDataRegistro(registro);
    descricao.textContent = registro.descricao;
    botaoRemover.type = "button";
    botaoRemover.textContent = "Remover";
    botaoRemover.setAttribute("aria-label", `Remover registro: ${registro.titulo}`);
    botaoRemover.addEventListener("click", () => removerRegistro(registro.id));

    cartao.append(titulo, data, descricao, botaoRemover);
    listaRegistros.append(cartao);
  }
}

function atualizarOrdemRegistros(ordem) {
  ordemRegistros = ordem;
  botaoOrdemRecentes.setAttribute("aria-pressed", String(ordem === "recentes"));
  botaoOrdemAntigas.setAttribute("aria-pressed", String(ordem === "antigas"));
  renderizarRegistros();
}

botaoOrdemRecentes.addEventListener("click", () => atualizarOrdemRegistros("recentes"));
botaoOrdemAntigas.addEventListener("click", () => atualizarOrdemRegistros("antigas"));

formularioRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const novoRegistro = {
    id: Date.now(),
    titulo: campoTitulo.value.trim(),
    descricao: campoDescricao.value.trim(),
    ano: Number(campoAno.value),
    mes: Number(campoMes.value),
    dia: seletorDia.value ? Number(seletorDia.value) : null,
  };

  registros.unshift(novoRegistro);
  localStorage.setItem(chaveArmazenamento, JSON.stringify(registros));
  renderizarRegistros();

  formularioRegistro.reset();
  atualizarDiasDisponiveis();
  formularioDialogo.close();
});

renderizarRegistros();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((erro) => console.error("Falha ao registrar o service worker:", erro));
  });
}
