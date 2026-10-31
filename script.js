// E-mail que recebe as mensagens do formulário (troque aqui se precisar)
const EMAIL_DA_EQUIPE = "tecmudaofc@gmail.com";

const telas = document.querySelectorAll(".tela");
const abas = document.querySelectorAll(".aba");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

document.getElementById("emailTxt").textContent = EMAIL_DA_EQUIPE;

// Sol: troca entre tema claro e escuro (e lembra a escolha neste navegador)
const temaBtn = document.getElementById("temaBtn");
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  temaBtn.setAttribute("aria-pressed", tema === "escuro");
  temaBtn.setAttribute("aria-label", tema === "escuro" ? "Mudar para tema claro" : "Mudar para tema escuro");
}
aplicarTema(document.documentElement.dataset.tema === "escuro" ? "escuro" : "claro");
temaBtn.addEventListener("click", () => {
  const novo = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
  aplicarTema(novo);
  try { localStorage.setItem("tema", novo); } catch (e) {}
});

// Troca entre as duas telas pelo endereço (#sobre ou #contato)
function mostrarTela() {
  const id = location.hash === "#contato" ? "contato" : "sobre";
  telas.forEach(t => t.classList.toggle("ativa", t.id === "tela-" + id));
  abas.forEach(a => {
    const ativa = a.dataset.tela === id;
    a.classList.toggle("ativa", ativa);
    if (ativa) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = (id === "contato" ? "Contato" : "Quem somos") + " | TecMuda";
  fecharMenu();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", mostrarTela);
mostrarTela();

// Menu do celular
function fecharMenu() {
  nav.classList.remove("aberto");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menu");
}
menuBtn.addEventListener("click", e => {
  e.stopPropagation();
  const aberto = nav.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", aberto);
  menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
document.addEventListener("click", e => {
  if (!nav.contains(e.target)) fecharMenu();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fecharMenu();
});

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
  const corpo = encodeURIComponent(
    form.msg.value.trim() + "\n\n" + form.nome.value.trim() + " (" + form.email.value.trim() + ")"
  );
  aviso.className = "aviso bom";
  aviso.textContent = "Abrindo seu aplicativo de e-mail para enviar.";
  window.location.href = `mailto:${EMAIL_DA_EQUIPE}?subject=${assunto}&body=${corpo}`;
  form.reset();
});