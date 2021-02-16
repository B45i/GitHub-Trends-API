const express = require('express');
const cors = require('cors');
const x = require('x-ray-scraper');
const fs = require('fs');

const app = express();
app.use(cors());
app.options('*', cors());
const port = process.env.PORT || 5000;

URL = 'https://github.com/trending';

x(URL, '.Box-row', [
    {
        repo: 'h1 a@href',
        description: 'p',
        language: 'div.f6 span:nth-child(2)',
        stars: 'div.f6 a:nth-child(2)',
        forks: 'div.f6 a:nth-child(3)',
        starChanges: 'div.f6 span.float-sm-right',
        contributors: x('div.f6 span.d-inline-block.mr-3', ['a@href']),
    },
]).then(res => {
    const data = (res || []).map(r => {
        return {
            ...r,
            description: (r.description || '').trim(),
            stars: (r.stars || '').trim(),
            forks: (r.forks || '').trim(),
            starChanges: (r.starChanges || '').trim(),
        };
    });
    fs.writeFileSync('results.json', JSON.stringify(data));
});
// .write('results.json');

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
