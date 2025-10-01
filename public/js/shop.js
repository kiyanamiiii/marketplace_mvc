const API = '/api/products';

function getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}

let products = [];
let cart = [];

async function loadProducts() {
  try {
    const res = await fetch(API);
    products = await res.json();
    renderProducts();
  } catch {
    alert('Erro ao carregar produtos');
  }
}

function renderProducts() {
  const div = document.getElementById('products');
  div.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.innerHTML = `<b>${p.name}</b> - R$ ${Number(p.price).toFixed(2)} - estoque ${p.stock}
      <button data-id="${p.id}">Ver/Adicionar</button>`;
    const btn = el.querySelector('button');
    btn.addEventListener('click', () => {
      const qtyStr = prompt('Quantidade:', '1');
      const qty = Number(qtyStr);
      if (!qty || qty <= 0) return;
      if (qty > p.stock) { alert('Quantidade maior que estoque'); return; }
      const existing = cart.find(i => i.id === p.id);
      if (existing) existing.qty += qty; else cart.push({ id: p.id, name: p.name, price: Number(p.price), qty });
      renderCart();
    });
    div.appendChild(el);
  });
}

function renderCart() {
  const cdiv = document.getElementById('cart');
  cdiv.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.innerHTML = `${item.name} x ${item.qty} = R$ ${(item.price * item.qty).toFixed(2)} <button data-id="${item.id}">rem</button>`;
    el.querySelector('button').onclick = () => {
      cart = cart.filter(i => i.id !== item.id);
      renderCart();
    };
    cdiv.appendChild(el);
  });
  document.getElementById('total').innerText = total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!user || user.role === 'admin') { alert('Acesso inválido'); location.href = '/'; return; }

  document.getElementById('checkout').addEventListener('click', async () => {
    if (!cart.length) { alert('Carrinho vazio'); return; }
    try {
      const res = await fetch(API + '/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, items: cart })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err.error || 'Erro na compra');
      }
      const invoice = document.getElementById('invoice');
      invoice.style.display = 'block';
      invoice.innerHTML = `<h3>Nota Fiscal</h3><div>Nome: ${user.name}</div><div>CPF: ${user.cpf}</div>` +
        `<ul>${cart.map(i => `<li>${i.name} x ${i.qty} = R$ ${(i.price * i.qty).toFixed(2)}</li>`).join('')}</ul>` +
        `<div>Total: R$ ${document.getElementById('total').innerText}</div>`;
      window.print();
      cart = [];
      renderCart();
      await loadProducts();
    } catch {
      alert('Erro de conexão');
    }
  });

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    location.href = '/';
  });

  loadProducts();
});
