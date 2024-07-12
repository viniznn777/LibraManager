const sanitizeHtml = require("sanitize-html");

class Validator {
  static validateCompanyName(name) {
    return typeof name === "string" && name.trim() !== "";
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(pass) {
    return typeof pass === "string" && pass.length >= 6;
  }

  static validateRegistration({ name, email, pass }) {
    return (
      this.validateCompanyName(name) &&
      this.validateEmail(email) &&
      this.validatePassword(pass)
    );
  }

  static validateLogin({ email, pass }) {
    return this.validateEmail(email) && this.validatePassword(pass);
  }

  static sanitizeText(text) {
    return sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  static sanitizeData(data) {
    for (let key in data) {
      if (typeof data[key] === "string") {
        data[key] = this.sanitizeText(data[key]);
      }
    }
    return data;
  }
}

module.exports = Validator;
