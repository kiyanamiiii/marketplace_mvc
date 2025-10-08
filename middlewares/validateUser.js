function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0,
    resto;

  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

function validateUser(req, res, next) {
  const { name, cpf, password } = req.body;

  if (!name || !cpf || !password) {
    return res
      .status(400)
      .json({ error: "Preencha todos os campos obrigatórios." });
  }

  if (!isValidCPF(cpf)) {
    return res
      .status(400)
      .json({ error: "CPF inválido. Verifique os números e tente novamente." });
  }

  next();
}

module.exports = validateUser;
