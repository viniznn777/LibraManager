const mongoose = require("mongoose");

// Middleware para verificar se o id passado no request é um id de usuário válido. Caso não seja, será retornado o codigo http 401 de não autorizado.

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const verifyUserId = (req, res, next) => {
  const COMPANY_ID = req.cookies.id;

  if (!COMPANY_ID || !isValidObjectId(COMPANY_ID)) {
    return res.status(401).json({ message: "Unauthorized: Invalid user ID" });
  }

  req.Company = COMPANY_ID;

  next();
};

module.exports = verifyUserId;
