const express = require('express');
const cors = require('cors');
const x = require('x-ray-scraper');

const app = express();
app.use(cors());
app.options('*', cors());
const port = process.env.PORT || 5000;

const BASE_URL = 'https://github.com/trending';

async function getTrends(url) {
    res = await x(url, '.Box-row', [
        {
            repo: 'h1 a@href',
            description: 'p',
            language: 'div.f6 span:nth-child(2)',
            stars: 'div.f6 a:nth-child(2)',
            forks: 'div.f6 a:nth-child(3)',
            starChanges: 'div.f6 span.float-sm-right',
            contributors: x('div.f6 span.d-inline-block.mr-3', ['a@href']),
        },
    ]);

    return (res || []).map(r => {
        return {
            ...r,
            description: (r.description || '').trim(),
            stars: (r.stars || '').trim(),
            forks: (r.forks || '').trim(),
            starChanges: (r.starChanges || '').trim(),
        };
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/trending/:lang?', async (req, res) => {
    const url = `${BASE_URL}/${req.params.lang ? req.params.lang : ''}${
        req.query.since ? '?' + req.query.since : ''
    }`;
    res.send(await getTrends(url));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
