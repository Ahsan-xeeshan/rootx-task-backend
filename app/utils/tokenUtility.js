const jwt = require("jsonwebtoken");

const TokenEncode = (email, user_id, role) => {
  const KEY = process.env.JWT_KEY;
  const EXPIRE = { expiresIn: process.env.JWT_EXPIRE_TIME };
  const PAYLOAD = { email: email, user_id: user_id, role: role };
  return jwt.sign(PAYLOAD, KEY, EXPIRE);
};
const TokenDecode = (token) => {
  try {
    const KEY = process.env.JWT_KEY;
    return jwt.verify(token, KEY);
  } catch (e) {
    return null;
  }
};

module.exports = { TokenDecode, TokenEncode };
