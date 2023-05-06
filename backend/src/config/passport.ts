import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { User } from 'types/index';
import redis from '@config/db';
import { IncomingMessage } from 'http';

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

  passport.serializeUser((user: IncomingMessage, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((id: string, done: any) => {
    // TODO: Implement this
    // User.findById(id, (err: Error, doc: IMongoDBUser) => {
    //   // Whatever we return goes to the client and binds to the req.user property
    //   return done(null, doc);
    // });
  });
};

export default setupPassport;
