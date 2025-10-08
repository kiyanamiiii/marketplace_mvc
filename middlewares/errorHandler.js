// errorHandler.js — Middleware para tratamento global de erros
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
}

module.exports = errorHandler;
