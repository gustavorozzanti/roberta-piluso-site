// Troque pelo WhatsApp real (DDI + DDD + número, só dígitos). Ex.: 5521999999999
const WHATSAPP = "";

const menu = document.getElementById("menu");
const burger = document.querySelector(".burger");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

document.getElementById("y").textContent = new Date().getFullYear();

// Monta a mensagem a partir dos campos do formulário (rótulo: valor)
const form = document.getElementById("form");
form.addEventListener("submit", e => {
  e.preventDefault();
  const hint = document.getElementById("hint");
  if (!form.elements.nome.value.trim()) { hint.textContent = "Informe seu nome."; return; }
  const lines = [form.dataset.intro || "Olá, Roberta!"];
  form.querySelectorAll("label").forEach(l => {
    const field = l.querySelector("input,select,textarea");
    const v = field && field.value.trim();
    if (v) lines.push(`${l.firstChild.textContent.trim()}: ${v}`);
  });
  if (!WHATSAPP) {
    hint.textContent = "Número de WhatsApp ainda não configurado (script.js).";
    return;
  }
  hint.textContent = "";
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
