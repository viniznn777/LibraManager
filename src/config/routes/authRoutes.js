const express = require("express");
const authController = require("../controllers/authController");
const routes = express.Router();

routes.post("/register", authController.registerCompany);

module.exports = routes;
