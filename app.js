import express from 'express';
import expressHandlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
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
        let data = JSON.parse(await fs.readFile('./data/table.json', 'utf-8'));
        if (req.session.user == 'admin') {
            res.render('index', {table: data, show: true});
        } else  {
            res.render('index', {table: data, show: false});
        }
    } else {
        res.redirect('/login/')
    }
})

app.get('/login/', (req, res) => {
    res.render('login', {error: ''})
})

app.post('/login/', urlEncodedParser, async (req, res) => {
    let users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'));
    if (users[req.body.userName] == req.body.password) {
        let userName = req.body.userName;
        req.session.user = userName;
        res.redirect('/');
    } else {
        res.render('login', {error: 'Wrong username or password'});
    }
})

app.post('/logout/', urlEncodedParser, (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
})

app.post('/editCell-:num', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/table.json', 'utf-8'));
    let params = req.params.num;
    data[params[0]][params[1]] = req.body.edit;
    await fs.writeFile('./data/table.json', JSON.stringify(data))
    res.redirect('/')
})

app.post('/delRow-:num', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/table.json', 'utf-8'));
    let copy = Object.assign([], data);
    copy.splice((req.params.num), 1);
    await fs.writeFile('./data/table.json', JSON.stringify(copy));
    res.redirect('/')
})

app.post('/', urlEncodedParser, async (req, res) => {
    let data = JSON.parse(await fs.readFile('./data/table.json', 'utf-8'));
    data.push([req.body.job, req.body.day, req.body.time]);
    await fs.writeFile('./data/table.json', JSON.stringify(data))
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server has been started on port 3000');
})