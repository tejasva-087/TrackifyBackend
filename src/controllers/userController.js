exports.getUser = (req, res, next) => {
  res.json(req.user);
};
