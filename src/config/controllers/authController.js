const bcrypt = require("bcrypt");
const CompanyRegister = require("../models/companyRegisterModel");
const Validator = require("../helpers/validator");
const generateToken = require("../helpers/generateToken");

const registerCompany = async (req, res) => {
  let { name, email, password } = req.body;

  // SANITIZAR OS CAMPOS PARA REMOVER CARACTERES ESPECIAIS ( PROTEÇÃO CONTRA INJEÇÃO DE CÓDIGO OU XSS (CROSS-SITE-SCRIPTING) )
  ({ name, email, password } = Validator.sanitizeData({
    name,
    email,
    password,
  }));

  try {
    if (
      Validator.validateRegistration({
        name: name,
        email,
        pass: password,
      })
    ) {
      // VERIFICANDO SE O EMAIL INSERIDO JÁ É EXISTENTE NO BANCO DO DADOS
      const existingUser = await CompanyRegister.findOne({ email: email });

      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use!" });
      }

      // SENHA CRIPTOGRAFADA PARA SALVAR NO BANCO DE DADOS
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newCompany = new CompanyRegister({
        name,
        email,
        password: hashedPassword,
      });
      // SALVANDO NO BANCO DE DADOS
      await newCompany.save();

      return res
        .status(201)
        .json({ message: "Company created successfuly!", newCompany });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in registration" });
  }
};

const loginCompany = async (req, res) => {
  let { email, password } = req.body;

  // SANITIZAR OS CAMPOS PARA REMOVER CARACTERES ESPECIAIS ( PROTEÇÃO CONTRA INJEÇÃO DE CÓDIGO OU XSS (CROSS-SITE-SCRIPTING) )
  ({ email, password } = Validator.sanitizeData({
    email,
    password,
  }));

  try {
    if (!Validator.validateLogin({ email, pass: password })) {
      return res.status(400).json({ message: "Invalid Login" });
    }

    const foundedCompany = await CompanyRegister.findOne({ email: email });

    if (!foundedCompany) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    bcrypt.compare(password, foundedCompany.password, (err, isMatch) => {
      if (err) return done(err);

      if (isMatch) {
        const token = generateToken(foundedCompany);
        res.cookie("token", token, {
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
        });

        res.cookie("id", foundedCompany._id.toString(), {
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
        });

        console.log("Token cookie:", token);
        console.log("ID cookie:", foundedCompany._id.toString());

        return res.status(200).json({ CompanyName: foundedCompany.name });
      } else {
        return res.status(400).json({ message: "Invalid credentials!" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in registration" });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
};
