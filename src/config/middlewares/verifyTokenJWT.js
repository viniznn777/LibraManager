const jwt = require("jsonwebtoken");

// Este é um middleware para verificar a AUTENTICIDADE do Token JWT

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Adicione as informações do token ao objeto de solicitação para uso posterior
    req.company = decoded;

    // Continue para a próxima camada middleware ou rota
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
