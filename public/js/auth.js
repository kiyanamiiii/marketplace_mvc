const API = '/api/auth';

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    try {
      const res = await fetch(API + '/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, cpf })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Erro ao logar'); return; }
      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'admin') location.href = '/admin_products.html';
      else location.href = '/shop.html';
    } catch (err) { alert('Erro de rede'); }
  });

  document.getElementById('toRegister').addEventListener('click', () => location.href = '/register.html');
}

if (document.getElementById('regForm')) {
  document.getElementById('regForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const role = document.getElementById('role').value;
    try {
      const res = await fetch(API + '/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, cpf, role })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Erro no cadastro'); return; }
      alert('Cadastrado com sucesso');
      location.href = '/';
    } catch (err) { alert('Erro de rede'); }
  });

  document.getElementById('back').addEventListener('click', () => location.href = '/');
}
