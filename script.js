// ---- Configuração ----
// WhatsApp real (DDI + DDD + número, só dígitos). Ex.: 5521999999999
const WHATSAPP = "";
// URL do Web App do Google Apps Script que grava os leads na planilha (veja LEADS.md)
const LEADS_URL = "";

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

const form = document.getElementById("form");
const hint = document.getElementById("hint");
const btn = form.querySelector("button[type=submit]");

const legendOf = fs => fs.querySelector("legend").textContent.split(" (")[0];
const brDate = v => v.split("-").reverse().join("/");

form.addEventListener("submit", e => {
  e.preventDefault();
  hint.className = "hint";
  if (form.elements.site.value) return; // honeypot: robôs preenchem
  if (!form.elements.nome.value.trim()) { hint.textContent = "Informe seu nome."; return; }

  // Escolhas múltiplas (interesses)
  const interesses = [];
  const lines = [form.dataset.intro || "Olá, Roberta!"];
  for (const fs of form.querySelectorAll("fieldset.choices")) {
    const picked = [...fs.querySelectorAll("input:checked")].map(i => i.value);
    if (fs.dataset.required && !picked.length) { hint.textContent = `Marque ao menos uma opção em "${legendOf(fs)}".`; return; }
    interesses.push(...picked);
    if (picked.length) lines.push(`${legendOf(fs)}: ${picked.join("; ")}`);
  }

  // Demais campos
  const lead = { origem: form.dataset.origem, interesses };
  form.querySelectorAll(":scope > label").forEach(l => {
    const field = l.querySelector("input,select,textarea");
    let v = field.value.trim();
    if (field.type === "date" && v) v = brDate(v);
    lead[field.name] = v;
    if (v) lines.push(`${l.firstChild.textContent.trim()}: ${v}`);
  });

  if (!WHATSAPP && !LEADS_URL) {
    hint.textContent = "Contato ainda não configurado (script.js).";
    return;
  }

  // Origem da campanha, se houver (?utm_source=...)
  const q = new URLSearchParams(location.search);
  ["utm_source", "utm_medium", "utm_campaign"].forEach(k => { if (q.get(k)) lead[k] = q.get(k); });

  // Registra o lead na planilha (sem bloquear o WhatsApp)
  if (LEADS_URL) {
    fetch(LEADS_URL, { method: "POST", mode: "no-cors", keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(lead) }).catch(() => {});
  }

  if (WHATSAPP) {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    hint.textContent = "";
  } else {
    hint.className = "hint ok";
    hint.textContent = "Recebido! Entraremos em contato em breve.";
    btn.disabled = true;
  }
});
