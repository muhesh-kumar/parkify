import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '@interfaces/user';
import redis from '@config/db';

const setupPassport = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser: User = {
          id: profile.id,
          displayName: profile.displayName,
          imageURL:
            (profile?.photos as { value: string }[] | undefined)?.[0]?.value ??
            'NA',
          createdAt: new Date(),
        };

        try {
          const findUserById = async (id: string) => {
            const response = await redis.get(`user-${newUser.id}`);
            console.log(response);
            return response;
          };

          const user = await findUserById(newUser.id);

          if (user) {
            done(null, user);
          } else {
            const user = await redis.set(
              `user-${newUser.id}`,
              JSON.stringify(newUser)
            );
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    console.log('Serializing user: ', user);
    done(null, user);
  });

  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await redis.get(`user-${id}`);
      console.log('Deserialized user: ', user);
      done(null, user);
    } catch (err) {
      console.log('Error deserializing', err);
      done(err, null);
    }
  });
};

export default setupPassport;
