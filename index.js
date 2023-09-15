import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
let cPage;
let data;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    cPage = 'index';
    data = {
        currentPage: cPage
    };
    res.render((__dirname + '/views/index.ejs'), data);
});

app.get('/index', (req, res) => {
    cPage = 'index';
    data = {
        currentPage: cPage
    };
    res.render((__dirname + '/views/index.ejs'), data);
});

app.get('/work', (req, res) => {
    cPage = 'work';
    data = {
        currentPage: cPage
    };
    res.render((__dirname + '/views/work.ejs'), data);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
})

