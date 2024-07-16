const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyLoginSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

const CompanyLogin = mongoose.model("CompanyLogin", CompanyLoginSchema);

module.exports = CompanyLogin;
