const Validator = require("../helpers/validator");
const Book = require("../models/BookSchema");
const CompanyRegister = require("../models/companyRegisterModel");

const registerBook = async (req, res) => {
  let { title, author, category, status, company } = req.body;

  ({ title, author, category, status, company } = Validator.sanitizeData({
    title,
    author,
    category,
    status,
    company,
  }));

  try {
    // Verificar se a empresa existe
    const companyFound = await CompanyRegister.findById(company);
    if (!companyFound) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Verificar se o livro já existe dentro do contexto da empresa
    const existingBook = await Book.findOne({
      title,
      author,
      company,
    });

    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book already exists in this company" });
    }

    // Se o livro não existir, criar um novo
    const newBook = new Book({
      title,
      author,
      category,
      status,
      company,
    });

    await newBook.save();

    // Verificar se a categoria inserida já existe no Array categories.
    const categoryExists = companyFound.categories.includes(category);

    if (!categoryExists) {
      companyFound.categories.push(category);
    }

    // Adicionar o livro à lista apropriada na empresa
    if (status === "available" || !status) {
      companyFound.availableBooks.push(newBook._id);
    } else {
      companyFound.borrowedBooks.push(newBook._id);
    }

    // Adicionar o livro à lista geral de livros da empresa
    companyFound.books.push(newBook._id);

    // Salvar as alterações na empresa
    await companyFound.save();

    return res
      .status(201)
      .json({ message: "Book registered successfully", book: newBook });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in registration" });
  }
};

module.exports = { registerBook };
