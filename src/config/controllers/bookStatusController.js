const Book = require("../models/BookSchema");
const CompanyRegister = require("../models/companyRegisterModel");

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

// Exporta a função updateBookStatus para uso em outros arquivos
module.exports = { updateBookStatus };
