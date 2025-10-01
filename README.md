```markdown
# Supermercado MVC

Software gerenciador de supermercado utilizando o padrão MVC com Node.js, Express e SQLite. Projeto da disciplina Práticas em Desenvolvimento de Sistemas II, IFSC - Campus Gaspar.

## Requisitos

- 4 telas: Login, Cadastro de Usuário, Cadastro de Produtos (admin), Compra (cliente)
- Regras:
  - Administrador: cadastra/edita/remove produtos, não compra
  - Cliente: compra produtos, não edita
  - Atualização de estoque por compra
  - Banco de dados
  - Padrão MVC
  - Classes `Produto` e `Supermercado` com getters/setters
  - Deslogar sem fechar aplicação
  - Alertas para sucesso/erro
  - Hospedagem no GitHub

## Estrutura

```
supermercado-mvc/
├── server.js
├── db.js
├── package.json
├── controllers/
│   ├── authController.js
│   └── productController.js
├── models/
│   ├── Produto.js
│   └── Supermercado.js
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
└── public/
    ├── index.html
    ├── register.html
    ├── admin_products.html
    ├── shop.html
    └── js/
        ├── auth.js
        ├── admin_products.js
        └── shop.js
```

## Tecnologias

- Node.js
- Express
- SQLite3
- HTML5 + JavaScript (frontend)
- MVC
- REST API

## Instalação

1. **Pré-requisitos**: Node.js v16+, Git (opcional)
2. **Clonar repositório**:
   ```bash
   git clone https://github.com/SEU_USUARIO/supermercado-mvc.git
   cd supermercado-mvc
   ```
3. **Instalar dependências**:
   ```bash
   npm install
   ```
4. **Rodar servidor**:
   ```bash
   node server.js
   ```
   Ou com nodemon: `npx nodemon server.js`

Acesse: [http://localhost:3000](http://localhost:3000)

## Funcionamento

### Usuários
- **Administrador**: Gerencia produtos
- **Cliente**: Compra produtos

### Telas
- `/`: Login
- `/register.html`: Cadastro
- `/admin_products.html`: CRUD produtos (admin)
- `/shop.html`: Loja/carrinho (cliente)

## Rotas API

### Auth
| Método | Rota                 | Descrição           |
|--------|---------------------|---------------------|
| POST   | `/api/auth/register`| Cadastro de usuário |
| POST   | `/api/auth/login`   | Login (nome + CPF)  |

### Products
| Método | Rota                    | Descrição                     |
|--------|------------------------|-------------------------------|
| GET    | `/api/products`        | Lista produtos                |
| GET    | `/api/products/:id`    | Produto por ID                |
| POST   | `/api/products`        | Cria produto (admin)          |
| PUT    | `/api/products/:id`    | Atualiza produto (admin)      |
| DELETE | `/api/products/:id`    | Remove produto (admin)        |
| POST   | `/api/products/checkout`| Finaliza compra/atualiza estoque |

Admin endpoints requerem header: `x-role: admin`

## MVC
- **Model**: `Produto.js`, `Supermercado.js` (acesso SQLite)
- **View**: HTML/JS em `public/`
- **Controller**: `authController.js`, `productController.js`

## Testes via cURL

**Cadastrar admin**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","cpf":"00000000000","role":"admin"}'
```

**Cadastrar produto**:
```bash
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "x-role: admin" \
-d '{"name":"Arroz","description":"5kg","price":30.5,"stock":10}'
```

**Comprar (cliente)**:
```bash
curl -X POST http://localhost:3000/api/products/checkout \
-H "Content-Type: application/json" \
-d '{"user":{"name":"João","cpf":"11111111111","role":"client"},"items":[{"id":1,"qty":2}]}'
```

## Login & Sessões

- Sessão via `localStorage`
- Logout limpa `localStorage` e redireciona para login

## Scripts Úteis

**Resetar banco**:
- Deletar `database.sqlite` e reiniciar servidor

**Nodemon**:
```bash
npm install --save-dev nodemon
npx nodemon server.js
```

## Deploy

Plataformas sugeridas: Render, Railway, Vercel, Heroku

**Render**:
1. Subir repositório público no GitHub
2. Criar Web Service no Render
3. Configurar:
   - Build: `npm install`
   - Start: `node server.js`
4. Deploy

## Licença

MIT License. Livre para uso educacional.

## Créditos

Desenvolvido para Práticas em Desenvolvimento de Sistemas II, IFSC - Campus Gaspar.
```