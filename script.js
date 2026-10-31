// E-mail que recebe as mensagens do formulário (troque aqui se precisar)
const EMAIL_DA_EQUIPE = "tecmudaofc@gmail.com";

const telas = document.querySelectorAll(".tela");
const abas = document.querySelectorAll(".aba");
const temaBtn = document.getElementById("temaBtn");
document.getElementById("emailTxt").textContent = EMAIL_DA_EQUIPE;

// Sol: troca entre tema escuro e claro (e lembra a escolha neste navegador)
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  temaBtn.setAttribute("aria-pressed", tema === "claro");
  temaBtn.setAttribute("aria-label", tema === "claro" ? "Mudar para tema escuro" : "Mudar para tema claro");
}
aplicarTema(document.documentElement.dataset.tema === "claro" ? "claro" : "escuro");
temaBtn.addEventListener("click", () => {
  const novo = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";
  aplicarTema(novo);
  try { localStorage.setItem("tema", novo); } catch (e) {}
});

// Três telas pelo endereço: #inicio, #sobre ou #contato
const TITULOS = { inicio: "TecMuda", sobre: "Quem somos | TecMuda", contato: "Contato | TecMuda" };
function mostrarTela() {
  const pedido = location.hash.slice(1);
  const id = TITULOS[pedido] ? pedido : "inicio";
  telas.forEach(t => t.classList.toggle("ativa", t.id === "tela-" + id));
  abas.forEach(a => {
    const ativa = a.dataset.tela === id;
    a.classList.toggle("ativa", ativa);
    if (ativa) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.body.dataset.tela = id;
  document.title = TITULOS[id];
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", mostrarTela);
mostrarTela();

// Formulário: confere os campos e abre o e-mail do visitante com a mensagem pronta
const form = document.getElementById("form");
const aviso = document.getElementById("aviso");
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  [form.nome, form.email, form.msg].forEach(c => {
    const vazio = !c.value.trim();
    const ruim = c === form.email && !/^\S+@\S+\.\S+$/.test(c.value.trim());
    c.classList.toggle("erro", vazio || ruim);
    if (vazio || ruim) ok = false;
  });
  if (!ok) {
    aviso.className = "aviso ruim";
    aviso.textContent = "Preencha o nome, um e-mail válido e a mensagem.";
    return;
  }
  const assunto = encodeURIComponent("Contato pelo site TecMuda - " + form.nome.value.trim());
  const corpo = encodeURIComponent(form.msg.value.trim() + "\n\n" + form.nome.value.trim() + " (" + form.email.value.trim() + ")");
  aviso.className = "aviso bom";
  aviso.textContent = "Abrindo seu aplicativo de e-mail para enviar.";
  window.location.href = `mailto:${EMAIL_DA_EQUIPE}?subject=${assunto}&body=${corpo}`;
  form.reset();
});
