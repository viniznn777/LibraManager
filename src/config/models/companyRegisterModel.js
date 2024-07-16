const mongoose = require("mongoose");

// Modelo de Register para a Biblioteca
const CompanyRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  categories: [String],
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  availableBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const CompanyRegister = mongoose.model(
  "CompanyRegister",
  CompanyRegisterSchema
);

module.exports = CompanyRegister;
