exports.validateAdmin = async (req, res, next) => {
  let header = req.headers;
  const token = header.split(" ")[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  if (token !== process.env.TOKEN) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  next();
};
