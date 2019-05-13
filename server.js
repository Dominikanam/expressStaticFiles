var express = require('express');
var app = express();

app.use(express.static('assets'));

app.use('/store', (req, res, next) => {
    console.log('Jestem pośrednikiem przy żądaniu do /store');
    next();
});

app.set('view engine', 'pug');
app.set('views','./views');

app.get('/', (req, res) => {
    res.sendFile('/index.html');
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

app.get('/auth', (req, res) => {
	res.render('auth');
});

app.get('/auth/google', (req, res) => {
	res.render('auth-google');
});

var server = app.listen(3000, 'localhost', () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Przykładowa aplikacja nasłuchuje na http://' + host + ':' + port);
});