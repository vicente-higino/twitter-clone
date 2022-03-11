import bcrypt from "bcryptjs";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User as Userr } from "../DB/Models/User";
import { Profile } from "../DB/Models/Profile";

declare global {
    namespace Express {
        interface User extends Userr {
        }
    }
}
export const config = (passport: PassportStatic) => {
    function findUser(email: string) {
        return Userr.findOne({ where: { email }, include: [Profile] });
    }

    function findUserById(id: number) {
        return Userr.findByPk(id, { include: [Profile] });
    }
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        async (username, password, done) => {
            try {
                const user = await findUser(username);
                // usuário inexistente
                if (!user) { return done(null, false) }

                // comparando as senhas
                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid) return done(null, false)

                return done(null, user)
            } catch (err) {
                done(err, false);
            }
        }
    ));
}