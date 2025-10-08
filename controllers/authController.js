const db = require("../db");

exports.register = (req, res) => {
  const { name, cpf, role } = req.body;
  if (!name || !cpf || !role)
    return res.status(400).json({ error: "Dados incompletos" });
  if (!["admin", "client"].includes(role))
    return res.status(400).json({ error: "Role inválida" });

  const sql = "INSERT INTO users (name, cpf, role) VALUES (?,?,?)";
  db.run(sql, [name, cpf, role], function (err) {
    if (err)
      return res.status(400).json({ error: "CPF já cadastrado ou erro" });
    res.json({ id: this.lastID, name, cpf, role });
  });
};

// Login por nome + CPF
exports.login = (req, res) => {
  const { name, cpf } = req.body;
  if (!name || !cpf)
    return res.status(400).json({ error: "Dados incompletos" });
  db.get(
    "SELECT * FROM users WHERE cpf = ? AND name = ?",
    [cpf, name],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro no DB" });
      if (!row)
        return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(row);
    }
  );
};
