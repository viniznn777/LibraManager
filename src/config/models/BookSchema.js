const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "borrowed"], // Valores aceitos
    default: "available", // Valor Padrão
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyRegister",
    required: true,
  }, // Referência à empresa
});

// Índice para evitar duplicação de title e author dentro da mesma empresa
bookSchema.index({ title: 1, author: 1, company: 1 }, { unique: true });
// Ao registrar um novo book. Houve erro E11000, fui ao mongo ATLAS e fiz um drop index na collection de books, pois havia 2 index anteriores repetidos, causando conflito na adição do mesmo livro no login de outra empresa
/*

>title_1_author_1 = Excluímos este e deixamos apenas o de baixo.
>title_1_author_1_company_1

*/

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
