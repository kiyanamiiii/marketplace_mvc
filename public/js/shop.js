// public/js/shop.js
const API = "/api/products";

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

let products = [];
let cart = [];

async function loadProducts() {
  try {
    const res = await fetch(API);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erro ao carregar produtos");
      return;
    }
    products = await res.json();
    renderProducts();
  } catch {
    alert("Erro ao carregar produtos");
  }
}

function renderProducts() {
  const div = document.getElementById("products");
  div.innerHTML = "";

  (Array.isArray(products) ? products : []).forEach((p) => {
    const id = p.id ?? p._id ?? null;
    const name = p.name ?? p._name ?? "sem-nome";
    const price = Number(p.price ?? p._price ?? 0) || 0;
    const stock = Number(p.stock ?? p._stock ?? 0) || 0;

    const card = document.createElement("div");
    card.classList.add("card-product");

    const title = document.createElement("div");
    title.classList.add("product-title");
    title.textContent = name;
    card.appendChild(title);

    const priceEl = document.createElement("div");
    priceEl.classList.add("price");
    priceEl.textContent = `R$ ${price.toFixed(2)}`;
    card.appendChild(priceEl);

    const stockEl = document.createElement("div");
    stockEl.classList.add("small");
    stockEl.textContent = `estoque: ${stock}`;
    card.appendChild(stockEl);

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-add");
    btn.textContent = "Ver / Adicionar";
    btn.addEventListener("click", async () => {
      // exibir detalhes simples antes de adicionar
      const want = prompt(
        `Produto: ${name}\nPreço: R$ ${price.toFixed(
          2
        )}\nQuantidade disponível: ${stock}\n\nQuantidade para adicionar:`,
        "1"
      );
      const qty = Number(want);
      if (!qty || qty <= 0) return;
      if (qty > stock) {
        alert("Quantidade maior que estoque");
        return;
      }

      // adicionar ao carrinho (merge por id)
      const existing = cart.find((i) => i.id === id);
      if (existing) existing.qty += qty;
      else cart.push({ id, name, price, qty });
      renderCart();
    });
    card.appendChild(btn);

    div.appendChild(card);
  });
}

function renderCart() {
  const cdiv = document.getElementById("cart");
  cdiv.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;

    const row = document.createElement("div");
    row.classList.add("cart-item");

    const left = document.createElement("div");
    left.textContent = `${item.name} x ${item.qty} = R$ ${(
      item.price * item.qty
    ).toFixed(2)}`;

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "8px";
    right.style.alignItems = "center";

    const remBtn = document.createElement("button");
    remBtn.classList.add("btn", "btn-danger"); // garante estilo 'rem'
    remBtn.textContent = "rem";
    remBtn.addEventListener("click", () => {
      cart = cart.filter((i) => i.id !== item.id);
      renderCart();
    });

    right.appendChild(remBtn);
    row.appendChild(left);
    row.appendChild(right);
    cdiv.appendChild(row);
  });

  document.getElementById("total").innerText = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user || user.role === "admin") {
    alert("Acesso inválido");
    location.href = "/";
    return;
  }

  // garantir classes do logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) logoutBtn.classList.add("btn");

  document.getElementById("checkout").addEventListener("click", async () => {
    if (!cart.length) {
      alert("Carrinho vazio");
      return;
    }
    try {
      const res = await fetch(API + "/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, items: cart }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err.error || "Erro na compra");
      }
      const invoice = document.getElementById("invoice");
      invoice.style.display = "block";
      invoice.innerHTML =
        `<h3>Nota Fiscal</h3><div>Nome: ${user.name}</div><div>CPF: ${user.cpf}</div>` +
        `<ul>${cart
          .map(
            (i) =>
              `<li>${i.name} x ${i.qty} = R$ ${(i.price * i.qty).toFixed(
                2
              )}</li>`
          )
          .join("")}</ul>` +
        `<div>Total: R$ ${document.getElementById("total").innerText}</div>`;
      window.print();
      cart = [];
      renderCart();
      await loadProducts();
    } catch {
      alert("Erro de conexão");
    }
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "/";
  });

  loadProducts();
});
