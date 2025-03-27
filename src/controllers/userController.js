// TODO: UPDATE USER

exports.getUser = (req, res, next) => {
  res.json({ user: req.user });
};

exports.updateUser = (req, res, next) => {};
