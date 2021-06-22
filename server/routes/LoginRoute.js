import passport from "passport";

export function LoginRoute(req, res, next) {
  if (req.isAuthenticated()) {
    const { username } = req.user.profile;
    res.json({ username });
  } else {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send("fail"); }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        const { username } = user.profile;
        return res.json({ username });
      });
    })(req, res, next);
  }
}
