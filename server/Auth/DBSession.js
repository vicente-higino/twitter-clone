import pg from 'pg';
const { Pool } = pg;
import { config } from "dotenv";
config();
export default (async () => {
    const connection = new Pool({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
    });
    const querry = `CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      
      ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
      
      CREATE INDEX "IDX_session_expire" ON "session" ("expire");`
    connection.query(querry, (err, res) => {
        // console.log(err, res)
        connection.end()
    });
});


