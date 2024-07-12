const bcrypt = require("bcrypt");
const CompanyLogin = require("../models/companyLoginModel");
const Validator = require("../helpers/validator");

const registerCompany = async (req, res) => {
  let { companyName, email, password } = req.body;

  // SANITIZAR OS CAMPOS PARA REMOVER CARACTERES ESPECIAIS ( PROTEÇÃO CONTRA INJEÇÃO DE CÓDIGO OU XSS (CROSS-SITE-SCRIPTING) )
  ({ companyName, email, password } = Validator.sanitizeData({
    companyName,
    email,
    password,
  }));

  try {
    if (
      Validator.validateRegistration({
        name: companyName,
        email,
        pass: password,
      })
    ) {
      // VERIFICANDO SE O EMAIL INSERIDO JÁ É EXISTENTE NO BANCO DO DADOS
      const existingUser = await CompanyLogin.findOne({ email: email });

      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use!" });
      }

      // SENHA CRIPTOGRAFADA PARA SALVAR NO BANCO DE DADOS
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newCompany = new CompanyLogin({
        email: email,
        password: hashedPassword,
        companyName: companyName,
      });
      // SALVANDO NO BANCO DE DADOS
      await newCompany.save();

      return res.status(201).json({ message: "Company created successfuly!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in registration" });
  }
};

module.exports = {
  registerCompany,
};
