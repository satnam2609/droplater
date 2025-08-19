exports.validateAdmin = async (req, res, next) => {
  let header = req.headers["authorization"];
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  if (token !== "1fd03fbad85c26e557e044724fb281f0") {
    //process.env.TOKEN
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  next();
};
