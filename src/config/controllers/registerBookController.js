const Validator = require("../helpers/validator");
const Book = require("../models/BookSchema");
const CompanyRegister = require("../models/companyRegisterModel");

const registerBook = async (req, res) => {
  let { title, author, category, status, company } = req.body; // Neste caso o company será recebido do front-end, pois o servidor retornou em forma de cookie quando o usuário fez o login na aplicação.

  ({ title, author, category, status, company } = Validator.sanitizeData({
    title,
    author,
    category,
    status,
    company,
  }));

  try {
    // Verificar se a empresa existe
    const findCompany = await CompanyRegister.findById(company);
    if (!findCompany) {
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

    // Adicionar o livro à empresa
    findCompany.books.push(newBook._id);
    await findCompany.save();

    return res
      .status(201)
      .json({ message: "Book registered successfully", book: newBook });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in registration" });
  }
};

module.exports = { registerBook };
