import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { User, Profile } from "../DB/Database.js";

export const config = (passport) => {
    function findUser(email) {
        return User.findOne({ where: { email }, include: [Profile] });
    }

    function findUserById(id) {
        return User.findByPk(id, { include: [Profile] });
    }
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
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