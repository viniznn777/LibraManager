const express = require("express");
const routes = express.Router();
const registerBookController = require("../controllers/registerBookController");
const bookStatusController = require("../controllers/bookStatusController");

routes.post("/register_book", registerBookController.registerBook);
routes.put("/update_book_status", bookStatusController.updateBookStatus);

module.exports = routes;
