const API = '/api/products';

function getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}

async function requireAdminOrRedirect() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    alert('Acesso negado');
    location.href = '/';
    return null;
  }
  return user;
}

async function load() {
  const user = await requireAdminOrRedirect();
  if (!user) return;
  try {
    const res = await fetch(API);
    const list = await res.json();
    const div = document.getElementById('list');
    div.innerHTML = '';
    list.forEach(p => {
      const el = document.createElement('div');
      el.innerHTML = `<b>${p.name}</b> — R$ ${Number(p.price).toFixed(2)} — estoque: ${p.stock}
        <button data-id="${p.id}" class="edit">Editar</button>
        <button data-id="${p.id}" class="del">Remover</button>`;
      div.appendChild(el);
    });

    document.querySelectorAll('.del').forEach(btn => btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Remover produto?')) return;
      await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { 'x-role': user.role }
      });
      load();
    });

    document.querySelectorAll('.edit').forEach(btn => btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      const name = prompt('Novo nome:');
      if (!name) return;
      const price = prompt('Preço:');
      const stock = prompt('Estoque:');
      await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-role': user.role
        },
        body: JSON.stringify({ name, description: '', price, stock })
      });
      load();
    });

  } catch (err) {
    alert('Erro ao carregar produtos');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!user || user.role !== 'admin') { alert('Acesso negado'); location.href = '/'; return; }

  document.getElementById('create').addEventListener('click', async () => {
    const name = document.getElementById('p_name').value.trim();
    const desc = document.getElementById('p_desc').value.trim();
    const price = document.getElementById('p_price').value;
    const stock = document.getElementById('p_stock').value;
    if (!name) { alert('Nome exigido'); return; }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': user.role
        },
        body: JSON.stringify({ name, description: desc, price, stock })
      });
      if (!res.ok) { const err = await res.json().catch(()=>({})); return alert(err.error || 'Erro ao criar'); }
      alert('Produto criado');
      document.getElementById('p_name').value = '';
      document.getElementById('p_desc').value = '';
      document.getElementById('p_price').value = '';
      document.getElementById('p_stock').value = '';
      load();
    } catch {
      alert('Erro de conexão');
    }
  });

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    location.href = '/';
  });

  load();
});
