const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // Definindo a expiração do token (1 hora)
  const expiresIn = "1h";

  // Criado o token com o payload, a chave secreta e o tempo de expiração
  return jwt.sign(
    { _id: user._id },
    // Secret Key
    process.env.SECRET_KEY,
    { expiresIn }
  );
};

module.exports = generateToken;
