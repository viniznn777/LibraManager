const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Modelo de Login para a Biblioteca

const CompanyLoginSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
});

const CompanyLogin = mongoose.model("CompanyLogin", CompanyLoginSchema);

module.exports = CompanyLogin;
