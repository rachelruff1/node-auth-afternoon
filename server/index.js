const express = require("express");
const session = require("express-session");
const passport = require("passport");
const request = require("request");

const strategy = require(`${__dirname}/strategy`);
const { clientID } = require(`${__dirname}/../config.js`);
const app = express();

app.use(
  session({
    secret: "@nyth!ng y0u w@nT",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/followers",
    failureRedirect: "/login",
    failureFlash: true,
    connection: "github"
  })
);

app.get("/followers", (req, res, next) => {
  if (req.user) {
    const FollowersRequest = {
      url: `https://api.github.com/users/${req.user.nickname}/followers`,
      headers: {
        "User-Agent": clientID
      }
    };
    request(FollowersRequest, (err, resp, body)=> {
      res.status(200).json(body);
      console.log(FollowersRequest);
      console.log(req.user);
    });
  } else {
    res.redirect("/login");
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
