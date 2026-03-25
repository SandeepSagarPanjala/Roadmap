import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "fallback_access_secret_do_not_use_in_prod";

export const authenticateToken = (req, res, next) => {
  // Try getting token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access Token is missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // 403 means that the client provided a token but it's invalid (e.g., expired)
      return res
        .status(403)
        .json({ message: "Access Token is invalid or expired" });
    }

    // Attach the user information to the request object so next handlers can use it
    req.user = user;
    next();
  });
};
