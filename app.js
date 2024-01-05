import express from 'express';
import expressHandlebars from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import fs from 'fs/promises';


const app = express();
const handlebars = expressHandlebars.create({defaultLayout: 'main', extname: 'hbs'});
const __dirname = path.resolve();

let urlEncodedParser = express.urlencoded({extended: false})

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/static'));
app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true,
}))

app.get('/', async (req, res) => {
    if (req.session.user) {
        let data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
        res.render('index', {table: data[req.session.user].table, username: req.session.user});
    } else {
        res.redirect('/login');
    }
})

app.get('/login/', (req, res) => {
    res.render('login', {error: ''})
})

app.get('/register', async(req, res) => {
    res.render('register')
})

app.get('/changePassword/', async(req, res) => {
    res.render('changePassword')
})

app.post('/login/', urlEncodedParser, async (req, res) => {
    let users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    if (users[req.body.userName].password == req.body.password) {
        let userName = req.body.userName;
        req.session.user = userName;
        res.redirect('/');
    } else {
        res.render('login', {error: 'Wrong username or password'});
    }
})

app.post('/register/', urlEncodedParser, async (req, res) => {
    let users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    if (users[req.body.userName]) {
        res.render('register', {error: 'U cant use this name'});
    } else {
        users[req.body.userName] = {
            'password': req.body.password,
            'table': []
        }
        req.session.user = req.body.userName;
        await fs.writeFile('./data/users.json', JSON.stringify(users));
        res.redirect('/');
    }
})

app.post('/logout/', urlEncodedParser, (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
})

app.post('/changePassword/', urlEncodedParser, async(req, res) => {
    let users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))
    if (users[req.session.user].password == req.body.oldPassword) {
        console.log(users[req.session.user].password)
        users[req.session.user].password = req.body.newPassword;
        await fs.writeFile('./data/users.json', JSON.stringify(users))
        res.redirect('/');
    } else {
        res.render('changePassword', {error: 'Incorrect old password'})
    }
})

app.post('/editCell-:num', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    let params = req.params.num;
    data[req.session.user].table[params[0]][params[1]] = req.body.edit;
    await fs.writeFile('./data/users.json', JSON.stringify(data))
    res.redirect('/')
})

app.post('/delRow-:num', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    data[req.session.user].table.splice((req.params.num), 1)
    await fs.writeFile('./data/users.json', JSON.stringify(data));
    res.redirect('/')
})

app.post('/', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    data[req.session.user].table.push([req.body.job, req.body.day, req.body.time]);
    await fs.writeFile('./data/users.json', JSON.stringify(data))
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server has been started on port 3000');
})