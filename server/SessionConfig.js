import session from "express-session";
import persist_session_pg from "connect-pg-simple";
const pgSession = persist_session_pg(session);

const secrets = ['80j3d8ja8sjd83nadsadj3ij', 'WyR6HpVNjmitQW58qI3qh1K1W', 'fD8fGXRA0VCtej2igArwoKQVB',
  'pR8uMl03iExN4bCQlh1lrvHzv', 'WSi3a0FoHX5UMGp2WbHBjhlql'];

export default session({
  store: new pgSession({
    conObject: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    }
  }),
  secret: secrets,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 } // 30 days
});
