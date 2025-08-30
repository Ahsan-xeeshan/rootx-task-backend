const { TokenDecode } = require("../utils/tokenUtility");

const authMiddleware = (req, res, next) => {
  const token = req.cookies["access_token"];

  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "Token not provided" });
  }

  const decoded = TokenDecode(token);
  if (!decoded) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  req.user = {
    email: decoded.email,
    user_id: decoded.user_id,
    role: decoded.role,
  };
  next();
};

module.exports = authMiddleware;
