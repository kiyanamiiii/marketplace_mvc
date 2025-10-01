const Supermercado = require('../models/Supermercado');

// Helper: checar se é admin (pode ser reforçado por sessão/JWT)
function requireAdmin(req, res) {
  const role = req.headers['x-role'] || (req.body && req.body.user && req.body.user.role);
  if (role !== 'admin') {
    res.status(403).json({ error: 'Ação permitida somente para administradores' });
    return false;
  }
  return true;
}

exports.list = (req, res) => {
  Supermercado.listar((err, produtos) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar produtos' });
    res.json(produtos);
  });
};

exports.get = (req, res) => {
  const { id } = req.params;
  Supermercado.buscarPorId(id, (err, produto) => {
    if (err) return res.status(500).json({ error: 'Erro no DB' });
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  });
};

exports.create = (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { name, description = '', price = 0, stock = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome exigido' });
  const prod = { name, description, price: Number(price), stock: Number(stock) };
  Supermercado.criar(prod, (err, p) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar' });
    res.json(p);
  });
};

exports.update = (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params;
  const { name, description = '', price = 0, stock = 0 } = req.body;
  const prod = { id: Number(id), name, description, price: Number(price), stock: Number(stock) };
  Supermercado.atualizar(prod, err => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar' });
    res.json({ success: true });
  });
};

exports.remove = (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params;
  Supermercado.remover(id, err => {
    if (err) return res.status(500).json({ error: 'Erro ao remover' });
    res.json({ success: true });
  });
};

exports.checkout = (req, res) => {
  const { user, items } = req.body; // user: {name, cpf, role}
  if (!user || !items) return res.status(400).json({ error: 'Dados incompletos' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Administrador não pode comprar' });

  // items: [{id, qty, price, name}]
  const simpleItems = items.map(it => ({ id: it.id, qty: it.qty }));
  Supermercado.processarCompra(simpleItems, err => {
    if (err) return res.status(500).json({ error: 'Erro ao processar compra' });
    // sugestão: registrar venda em tabela 'sales' (não implementado aqui)
    res.json({ success: true });
  });
};
