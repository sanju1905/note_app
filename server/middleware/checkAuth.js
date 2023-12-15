/**
 * login avvakunda dashboard ni access cheskokunda undeki security authentication
 */
exports.isLoggedIn = function (req, res, next) {
  if(req.user) {
    next();
  } else {
    return res.status(401).send('Access Denied');
  }
}