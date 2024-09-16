const express = require("express");
const routes = express.Router();
const verifyToken = require("../middlewares/verifyTokenJWT");
const verifyUserId = require("../middlewares/verifyUserID");
const registerBookController = require("../controllers/registerBookController");
const bookStatusController = require("../controllers/bookController");

// Rotas de controle de Livros

// Rota para registrar um livro em uma empresa
routes.post(
  "/register_book",
  verifyToken,
  verifyUserId,
  registerBookController.registerBook
);

// Rota para editar o status de um Livro
routes.put(
  "/update_book_status",
  verifyToken,
  verifyUserId,
  bookStatusController.updateBookStatus
);

// Rota para listar todos os livros, livros disponíveis e livros emprestados
routes.get("/books", verifyToken, verifyUserId, async (req, res) => {
  const status = req.query.status; // Captura o parâmetro de consulta 'status'

  try {
    // Verifica se um status foi fornecido e chama o método apropriado
    if (status === "available") {
      await bookStatusController.getAvailableBooks(req, res);
    } else if (status === "borrowed") {
      await bookStatusController.getBorrowedBooks(req, res);
    } else {
      // Se nenhum status ou um status inválido for fornecido, lista todos os livros
      await bookStatusController.getAllBooks(req, res);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
});

routes.delete(
  "/delete",
  verifyToken,
  verifyUserId,
  bookStatusController.deleteBook
);

module.exports = routes;
