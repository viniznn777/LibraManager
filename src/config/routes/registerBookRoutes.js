const express = require("express");
const routes = express.Router();
const registerBookController = require("../controllers/registerBookController");

routes.post("/register_book", registerBookController.registerBook);

module.exports = routes;
