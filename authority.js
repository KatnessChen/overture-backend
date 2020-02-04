module.exports = {
  checkAuthority(req, res, next) {
    if (req.body.userAccount === 'guest@gmail.com') {
      res.status(403);
      res.send({ message: 'Access denied :(', statusCode: 403 });
    } else {
      next();
    }
  }
}