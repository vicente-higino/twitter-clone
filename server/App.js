import express from "express";
import passport from "passport";
import { config } from "./Auth/auth.js";
import cors from 'cors';
import { isAuthenticated, privateRouter, router } from "./Routes/Routes.js";
import SessionConfig from "./Auth/SessionConfig.js";

const app = express();
config(passport);
app.use(cors())
app.use(SessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.raw({ type: 'application/octet-stream', limit: 1024 * 1024 * 1024 }));
app.use('/images', isAuthenticated);
app.use('/images', express.static('./images'));
app.use(router);
app.use(privateRouter);
app.listen(5000);