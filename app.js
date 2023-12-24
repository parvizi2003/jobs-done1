import express from 'express';
import __dirname from './dirname.js';
import fs from 'fs/promises';

let app = express();
let urlEncodedParser = express.urlencoded({extended: false})

app.get('/', async (req, res) => {
    let login = JSON.parse(await fs.readFile(__dirname + '/login.json'));
    if (login.isLogged == 'true') {
        try {
            let file = await fs.readFile(__dirname + '/public/index.html', 'utf-8');
            let data = JSON.parse(await fs.readFile(__dirname + '/data.json'));
            let table = '<table>';
            for (let elem of data) {
                table += '<tr>';
                for (let subElem of elem) {
                    table += '<td>' + subElem + '</td>';
                }
                table += '</tr>';
            }
            file = file.replace(/\{% get table %\}/, table)
            res.send(file);
        } catch {
            res.status(404).send('404 page not found');
        }    
    } else {
        res.redirect('/login');
    }
    
})

app.get('/login/',async (req, res) => {
    let file = await fs.readFile(__dirname + '/public/login.html', 'utf-8');
    file = file.replace(/\{% get error %\}/, '')
    res.send(file)
})

app.post('/handler/', urlEncodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    let data = JSON.parse(await fs.readFile(__dirname + '/data.json'));
    data.push([req.body.job, req.body.day, req.body.time]);
    data = JSON.stringify(data);
    await fs.writeFile(__dirname + '/data.json', data);
    res.redirect('/')
})

app.post('/login/', urlEncodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    let login = JSON.parse(await fs.readFile(__dirname + '/login.json'))
    if(login[req.body.userName]) {
        if (login[req.body.userName].password == req.body.password) {
            login.isLogged = 'true';
            await fs.writeFile(__dirname + '/login.json', JSON.stringify(login))
            res.redirect('/');
        } else {
            let file = await fs.readFile(__dirname + '/public/login.html');
            file = file.replace(/\{% get error %\}/, '<p>Wrong name or password</p>');
            res.send(file);    
        }
    } else {
        let file = await fs.readFile(__dirname + '/public/login.html', 'utf-8');
        file = file.replace(/\{% get error %\}/, '<p>Wrong name or password</p>');
        res.send(file);
    }
})

app.listen(3000, () => console.log('running'));