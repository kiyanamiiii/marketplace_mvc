// public/js/admin_products.js
const API = "/api/products";

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

async function requireAdminOrRedirect() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    alert("Acesso negado");
    location.href = "/";
    return null;
  }
  return user;
}

async function load() {
  const user = await requireAdminOrRedirect();
  if (!user) return;

  try {
    const res = await fetch(API);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erro ao buscar produtos");
      return;
    }

    const list = await res.json();
    const div = document.getElementById("list");
    div.innerHTML = "";

    (Array.isArray(list) ? list : []).forEach((p) => {
      // fallbacks para formatos antigos
      const id = p.id ?? p._id ?? null;
      const name = p.name ?? p._name ?? "sem-nome";
      const price = Number(p.price ?? p._price ?? 0) || 0;
      const stock = Number(p.stock ?? p._stock ?? 0) || 0;

      // container do produto (usa classes para CSS)
      const item = document.createElement("div");
      item.classList.add("product");

      // info
      const info = document.createElement("div");
      info.classList.add("product-info");

      const title = document.createElement("div");
      title.classList.add("product-title");
      title.textContent = name;

      const meta = document.createElement("div");
      meta.classList.add("product-meta");
      meta.textContent = `R$ ${price.toFixed(2)} — Estoque: ${stock}`;
      meta.innerHTML = `R$ ${price.toFixed(
        2
      )} — <span style="display:block; margin-bottom:8px;">Estoque: ${stock}</span>`;

      info.appendChild(title);
      info.appendChild(meta);
      item.appendChild(info);

      // controles (editar / remover)
      const controls = document.createElement("div");
      controls.classList.add("controls");

      const editBtn = document.createElement("button");
      editBtn.classList.add("btn", "btn-ghost");
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", async () => {
        if (!id) {
          alert("ID inválido");
          return;
        }
        const newName = prompt("Novo nome:", name);
        if (newName === null) return;
        const priceStr = prompt("Preço:", price.toString());
        if (priceStr === null) return;
        const stockStr = prompt("Estoque:", stock.toString());
        if (stockStr === null) return;

        const newPrice = Number(priceStr);
        const newStock = Number(stockStr);
        if (Number.isNaN(newPrice) || Number.isNaN(newStock)) {
          alert("Preço ou estoque inválido");
          return;
        }

        try {
          const r = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-role": user.role,
            },
            body: JSON.stringify({
              name: newName,
              description: "",
              price: newPrice,
              stock: newStock,
            }),
          });
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            alert(err.error || "Erro ao atualizar produto");
            return;
          }
          await load();
        } catch {
          alert("Erro de conexão ao atualizar");
        }
      });

      const delBtn = document.createElement("button");
      delBtn.classList.add("btn", "btn-danger"); // garante estilo vermelho
      delBtn.textContent = "Remover";
      delBtn.addEventListener("click", async () => {
        if (!id) {
          alert("ID inválido");
          return;
        }
        if (!confirm("Remover produto?")) return;
        try {
          const r = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: { "x-role": user.role },
          });
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            alert(err.error || "Erro ao remover produto");
            return;
          }
          await load();
        } catch {
          alert("Erro de conexão ao remover");
        }
      });

      controls.appendChild(editBtn);
      controls.appendChild(delBtn);
      item.appendChild(controls);

      div.appendChild(item);
    });
  } catch (err) {
    alert("Erro ao carregar produtos");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user || user.role !== "admin") {
    alert("Acesso negado");
    location.href = "/";
    return;
  }

  // garantir que o botão logout tenha as classes corretas
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) logoutBtn.classList.add("btn");

  document.getElementById("create").addEventListener("click", async () => {
    const nameEl = document.getElementById("p_name");
    const descEl = document.getElementById("p_desc");
    const priceEl = document.getElementById("p_price");
    const stockEl = document.getElementById("p_stock");

    const name = nameEl.value.trim();
    const desc = descEl.value.trim();
    const price = Number(priceEl.value);
    const stock = Number(stockEl.value);

    if (!name) {
      alert("Nome exigido");
      return;
    }
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      alert("Preço ou estoque inválido");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
        },
        body: JSON.stringify({ name, description: desc, price, stock }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err.error || "Erro ao criar");
      }
      alert("Produto criado");
      nameEl.value = "";
      descEl.value = "";
      priceEl.value = "";
      stockEl.value = "";
      await load();
    } catch {
      alert("Erro de conexão");
    }
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "/";
  });

  load();
});
