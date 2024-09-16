const Book = require("../models/BookSchema");
const CompanyRegister = require("../models/companyRegisterModel");

// Função para listar todos os livros de uma empresa
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ company: req.Company });

    if (books.length === 0) {
      return res.status(204).send(); // Status 204: No Content
    }

    res.status(200).json({ message: "Company Books", data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error when fetching company books" });
  }
};

// Função para listar todos os livros disponíveis de uma empresa
const getAvailableBooks = async (req, res) => {
  try {
    const availableBooks = await Book.find({
      status: "available",
      company: req.Company,
    });

    if (availableBooks.length === 0) {
      return res.status(204).send(); // Status 204: No Content
    }

    res.status(200).json({
      message: "Books available at the company",
      data: availableBooks,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error when fetching Books available at the company" });
  }
};

// Função para listar todos os livros emprestados de uma empresa
const getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Book.find({ status: "borrowed" });

    if (borrowedBooks.length === 0) {
      return res.status(204).send(); // Status 204: No Content
    }

    res.status(200).json({
      message: "Borrowed books at the company",
      data: borrowedBooks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error when fetching borrowed books at the company",
    });
  }
};

// Função para atualizar o status de um livro
const updateBookStatus = async (req, res) => {
  // Extrai os dados bookId e newStatus do corpo da requisição
  const { bookId, newStatus } = req.body;

  // Verifica se o newStatus é válido (deve ser 'available' ou 'borrowed')
  if (!["available", "borrowed"].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Procura o livro pelo ID fornecido
    const book = await Book.findById(bookId);

    // Se o livro não for encontrado, retorna uma resposta 404 (não encontrado)
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Procura a empresa pelo ID associado ao livro
    const company = await CompanyRegister.findById(book.company);

    // Se a empresa não for encontrada, retorna uma resposta 404 (não encontrado)
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Atualiza o status do livro com o novo status fornecido
    book.status = newStatus;
    await book.save(); // Salva a atualização no banco de dados

    // Se o novo status do livro for 'available' (disponível)
    if (newStatus === "available") {
      // Remove o livro da lista de livros emprestados (borrowedBooks) da empresa
      company.borrowedBooks = company.borrowedBooks.filter(
        (id) => !id.equals(book._id)
      );
      // Adiciona o livro à lista de livros disponíveis (availableBooks) da empresa, se ainda não estiver presente
      if (!company.availableBooks.includes(book._id)) {
        company.availableBooks.push(book._id);
      }
    } else {
      // Remove o livro da lista de livros disponíveis (availableBooks) da empresa
      company.availableBooks = company.availableBooks.filter(
        (id) => !id.equals(book._id)
      );
      // Adiciona o livro à lista de livros emprestados (borrowedBooks) da empresa, se ainda não estiver presente
      if (!company.borrowedBooks.includes(book._id)) {
        company.borrowedBooks.push(book._id);
      }
    }

    // Salva as atualizações da empresa no banco de dados
    await company.save();

    // Retorna uma resposta de sucesso indicando que o status do livro foi atualizado com sucesso
    return res
      .status(200)
      .json({ message: "Book status updated successfully" });
  } catch (err) {
    // Se ocorrer um erro, imprime no console e retorna uma resposta 500 (erro no servidor)
    console.error(err);
    return res.status(500).json({ message: "Error updating book status" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Verifica se o livro existe
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Encontra a empresa
    const company = await CompanyRegister.findById(req.Company);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Remove o livro da empresa
    company.books = company.books.filter((id) => !id.equals(bookId));

    // Salva as alterações na empresa
    await company.save();

    // Remove o livro do banco de dados
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({
      message: `Book with id ${bookId} successfully deleted from ${company.name} Library!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting book!" });
  }
};

// Exporta a função updateBookStatus para uso em outros arquivos
module.exports = {
  updateBookStatus,
  getAllBooks,
  getAvailableBooks,
  getBorrowedBooks,
  deleteBook,
};
