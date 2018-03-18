const express = require('express');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => res.send('Opponent'));

app.listen(port, host, () => console.log(`Opponent listening on ${host}:${port}`)); // eslint-disable-line no-console
