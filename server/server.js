import express from "express";
import passport from "passport";
import session from "express-session";
import persist_session_pg from "connect-pg-simple";
const pgSession = persist_session_pg(session);
import { config } from "./auth.js";
import cors from 'cors';
import dbSessionConfig from "./DBSession.js";
import { isAuthenticated, privateRouter, router } from "./Routes.js";

dbSessionConfig();

const app = express();
config(passport);
app.use(cors())
app.use(session({
  store: new pgSession({
    conObject: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    }
  }),
  secret: ['80j3d8ja8sjd83nadsadj3ij', 'WyR6HpVNjmitQW58qI3qh1K1W', 'fD8fGXRA0VCtej2igArwoKQVB', 'pR8uMl03iExN4bCQlh1lrvHzv', 'WSi3a0FoHX5UMGp2WbHBjhlql'],
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 } // 30 days
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.raw({ type: 'application/octet-stream', limit: '20mb' }));
app.use('/images', isAuthenticated);
app.use('/images', express.static('./images'));
app.use(router);
app.use(privateRouter);
app.listen(5000);