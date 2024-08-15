const express = require("express");
const authController = require("../controllers/authController");
const routes = express.Router();

routes.post("/register", authController.registerCompany);
routes.post("/login", authController.loginCompany);

module.exports = routes;
