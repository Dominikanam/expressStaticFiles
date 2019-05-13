const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
	new GoogleStrategy({
		clientID: config.GOOGLE_CLIENT_ID,
		clientSecret:config.GOOGLE_CLIENT_SECRET,
		callbackURL: config.CALLBACK_URL
	},
	(accessToken, refreshToken, profile, cb) => {
		googleProfile = {
			id: profile.id,
			displayName: profile.displayName
		};
		cb(null, profile);
	})
);

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('assets'));

app.use('/store', (req, res, next) => {
    console.log('Jestem pośrednikiem przy żądaniu do /store');
    next();
});

app.get('/userform', (req, res) => {
    const response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    res.json(response);
});

app.get('/store', (req, res) => {
    res.send('To jest sklep');
});

app.get('/first-template', (req, res) => {
    res.render('first-template');
});

app.get('/dynamic-view', (req, res) => {
    res.render('dynamic', {
        name: "Moja dynamiczna strona",
        url: "http://www.google.com"
    });
});

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/logged', (req, res) => {
    res.render('logged', { user: googleProfile });
});

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope : ['profile', 'email']
	})
);

app.get(
	'/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/logged',
        failureRedirect: '/'
	})
);

const server = app.listen(3000, 'localhost', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Przykładowa aplikacja nasłuchuje na http://' + host + ':' + port);
});
