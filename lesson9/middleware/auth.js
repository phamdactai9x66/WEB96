import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.tokenType !== "AT")
      return res.status(401).json({ message: "Invalid token type." });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token is invalid or expired." });
  }
};

// roles: ["MANAGER", "EMPLOYEE", ...]
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return res.status(403).json({ message: "Access denied." });
    next();
  };
};
