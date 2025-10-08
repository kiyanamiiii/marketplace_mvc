// ===== Validação de CPF =====
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0,
    rest;

  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(cpf.substring(10, 11));
}

// ===== Mensagens de erro/sucesso =====
function showErrorMessage(msg) {
  createAlert(msg, "error");
}

function showSuccessMessage(msg) {
  createAlert(msg, "success");
}

function createAlert(msg, type) {
  const el = document.createElement("div");
  el.className = `alert ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ===== Função de fetch com tratamento padrão =====
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    showErrorMessage(data.error || "Erro de conexão");
    throw new Error(data.error || "Erro");
  }
  return data;
}

// ===== Função para validar formulário básico =====
function requireFields(obj, fields) {
  for (const f of fields) {
    if (!obj[f] || obj[f].toString().trim() === "") {
      showErrorMessage(`Campo obrigatório: ${f}`);
      return false;
    }
  }
  return true;
}
