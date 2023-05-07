import express, { Response, NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Cannot login to Google, please try again',
    failureRedirect: 'http://localhost:5173', // redirect to homepage in client
    session: true,
  }),
  (req, res) => {
    console.log('User: ', req.user);
    res.send('Thank you for signing in');
    res.redirect('http://localhost:5173');
  }
);

router.get('/user', (req, res, next) => {
  console.log('/user called');
  // console.log(req.user);
  // if (req && req.user) {
  //   res.send(req.user);
  // } else {
  res.send('');
  // }
});

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('http://localhost:5173');
  });
});

export default router;
