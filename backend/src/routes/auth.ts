import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173', // redirect to homepage in client
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:5173');
  }
);

router.get('/user', (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    console.log(err);
  });
  res.send('http://localhost:5173');
});

export default router;
