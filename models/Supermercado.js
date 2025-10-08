// models/Supermercado.js
const db = require("../db");

class Supermercado {
  static listar(callback) {
    db.all(
      "SELECT id, name, description, price, stock FROM products",
      [],
      (err, rows) => {
        if (err) return callback(err);
        // mapear para objetos simples (não instâncias com _name)
        const produtos = rows.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price: r.price,
          stock: r.stock,
        }));
        callback(null, produtos);
      }
    );
  }

  static buscarPorId(id, callback) {
    db.get(
      "SELECT id, name, description, price, stock FROM products WHERE id = ?",
      [id],
      (err, row) => {
        if (err) return callback(err);
        if (!row) return callback(null, null);
        callback(null, {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          stock: row.stock,
        });
      }
    );
  }

  static criar(prod, callback) {
    db.run(
      "INSERT INTO products (name, description, price, stock) VALUES (?,?,?,?)",
      [prod.name, prod.description, prod.price, prod.stock],
      function (err) {
        if (err) return callback(err);
        callback(null, {
          id: this.lastID,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
        });
      }
    );
  }

  static atualizar(prod, callback) {
    db.run(
      "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
      [prod.name, prod.description, prod.price, prod.stock, prod.id],
      function (err) {
        if (err) return callback(err);
        callback(null);
      }
    );
  }

  // retorna erro se não removido (ajuda a detectar delete sem efeito)
  static remover(id, callback) {
    db.run("DELETE FROM products WHERE id=?", [id], function (err) {
      if (err) return callback(err);
      if (this.changes === 0)
        return callback(
          new Error("Nenhum produto removido (id não encontrado)")
        );
      callback(null);
    });
  }

  // processarCompra permanece igual (verifica estoque e atualiza)
  static processarCompra(items, callback) {
    db.serialize(() => {
      const checkNext = (i) => {
        if (i >= items.length) return doUpdates();
        const it = items[i];
        db.get(
          "SELECT stock FROM products WHERE id = ?",
          [it.id],
          (err, row) => {
            if (err) return callback(err);
            if (!row)
              return callback(new Error("Produto não encontrado: " + it.id));
            if (row.stock < it.qty)
              return callback(
                new Error("Estoque insuficiente para id: " + it.id)
              );
            checkNext(i + 1);
          }
        );
      };
      const doUpdates = () => {
        const stmt = db.prepare(
          "UPDATE products SET stock = stock - ? WHERE id = ?"
        );
        for (const it of items) stmt.run([it.qty, it.id]);
        stmt.finalize((err) => {
          if (err) return callback(err);
          callback(null);
        });
      };
      checkNext(0);
    });
  }
}

module.exports = Supermercado;
