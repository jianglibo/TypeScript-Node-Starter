/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import expressValidator = require("express-validator");
import { Request, Response, NextFunction } from "express";


// const MongoStore = mongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });


/**
 * Controllers (route handlers).
 */
import * as homeController from "./controllers/home";
import * as apiController from "./controllers/api";

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from "./config/passport";
import { readFileSync } from "fs";
import { project_root, from_project_root, getListContent } from './service/fixture-util';
import { JsonapiParamParser } from './service/jsonapi-param-parser';

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

// mongoose.connection.on("error", () => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running.");
//   process.exit();
// });



/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//     autoReconnect: true
//   })
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//       req.path !== "/login" &&
//       req.path !== "/signup" &&
//       !req.path.match(/^\/auth/) &&
//       !req.path.match(/\./)) {
//     req.session.returnTo = req.path;
//   } else if (req.user &&
//       req.path == "/account") {
//     req.session.returnTo = req.path;
//   }
//   next();
// });
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));


// const tf = from_project_root("fixtures", "manufacturergetone.json");

// const bf: Buffer = readFileSync(tf);

// const s = bf.toString("utf-8");

// console.log(s);
/**
 * Primary app routes.
 */
// app.get("/", homeController.index);
app.get("/jsonapi/:rss/:id", (req: Request, res: Response, next: NextFunction) => {
  const fn = from_project_root("fixtures", req.params.rss + ".json");
  const bf = readFileSync(fn);
  const jo = JSON.parse(bf.toString());
  const data = jo.data as Array<any>;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.id === req.params.id) {
      res.json({data: element});
      return;
    }
  }
  next(new Error('failed to load user'));
});


app.get("/jsonapi/:rss", (req: Request, res: Response) => {
  // console.log("rss");
  // const fn = from_project_root("fixtures", req.params.rss + ".json");
  // const bf = readFileSync(fn);
  const pol = JsonapiParamParser.offsetLimit(req.url);

  const fps = JsonapiParamParser.filters(req.url);
  // const jo = JSON.parse(bf.toString());
  // const data = jo.data as Array<any>;
  // jo.data = data.slice(pol.offset, pol.offset + pol.limit);
  const jo = getListContent(req.params.rss, pol, fps);
  res.json(jo);
});

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(req.session.returnTo || "/");
});


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;