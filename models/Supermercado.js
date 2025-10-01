const db = require('../db');
const Produto = require('./Produto');

class Supermercado {
  static listar(callback) {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) return callback(err);
      const produtos = rows.map(r => new Produto(r));
      callback(null, produtos);
    });
  }

  static buscarPorId(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);
      callback(null, new Produto(row));
    });
  }

  static criar(prod, callback) {
    db.run(
      'INSERT INTO products (name, description, price, stock) VALUES (?,?,?,?)',
      [prod.name, prod.description, prod.price, prod.stock],
      function (err) {
        if (err) return callback(err);
        prod.id = this.lastID;
        callback(null, prod);
      }
    );
  }

  static atualizar(prod, callback) {
    db.run(
      'UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?',
      [prod.name, prod.description, prod.price, prod.stock, prod.id],
      function (err) {
        if (err) return callback(err);
        callback(null);
      }
    );
  }

  static remover(id, callback) {
    db.run('DELETE FROM products WHERE id=?', [id], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  }

  // atualiza estoque: recebe [{id, qty}, ...] e decrementa se houver estoque suficiente
  static processarCompra(items, callback) {
    db.serialize(() => {
      const checks = [];
      const updates = [];

      // primeiro checar estoque suficiente para todos os itens
      const checkNext = (i) => {
        if (i >= items.length) return doUpdates();
        const it = items[i];
        db.get('SELECT stock FROM products WHERE id = ?', [it.id], (err, row) => {
          if (err) return callback(err);
          if (!row) return callback(new Error('Produto não encontrado: ' + it.id));
          if (row.stock < it.qty) return callback(new Error('Estoque insuficiente para id: ' + it.id));
          checkNext(i + 1);
        });
      };

      // se tudo OK, aplicar updates
      const doUpdates = () => {
        const stmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        for (const it of items) stmt.run([it.qty, it.id]);
        stmt.finalize(err => {
          if (err) return callback(err);
          callback(null);
        });
      };

      checkNext(0);
    });
  }
}

module.exports = Supermercado;
