const express = require("express");
const cors = require("cors");
const path = require("path");
require("./db"); // inicializa DB

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);
