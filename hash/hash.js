const crypto = require("crypto");

const hashingPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashObject = crypto.createHash("sha512");
  const hashedPassword = hashObject.update(password).digest("hex");
  return {
    salt,
    hashedPassword,
  };
};

const comparePassword = ({ hashedPassword, salt, rawPassword }) => {
  const hashedRawPassword = crypto
    .pbkdf2Sync(rawPassword, salt, 1000, 64, "sha1")
    .toString("hex");

  return hashedRawPassword === hashedPassword;
};

module.exports = {
  hashingPassword,
  comparePassword
};
