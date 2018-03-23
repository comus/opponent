const express = require('express');
const _ = require('lodash');
const quickDraw = require('quickdraw.js');
const neataptic = require('neataptic');
const fs = require('fs');
const path = require('path');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const categories = [
  'airplane', 
  'alarm clock', 
  'ambulance', 
  'angel',
  'apple',
  'axe',
  'baseball',
  'beard',
  'bed',
  'bicycle',
  'binoculars',
  'castle',
  'camel',
  'diamond',
  'dolphin',
  'elephant',
  'envelope',
  'fish',
  'flower',
  'golf club',
  'guitar',
  'hammer',
  'helicopter',
  'ice cream',
  'jail',
  'key',
  'knife',
  'light bulb',
  'lipstick',
  'monkey',
  'mushroom',
  'necklace',
  'octopus',
  'onion',
  'palm tree',
  'piano',
  'rifle',
  'roller coaster',
  'scissors',
  'snail',
  'shoe',
  'teapot',
  'tractor',
  'The Eiffel Tower',
  'umbrella',
  'underwear',
  'vase',
  'violin',
  'windmill',
  'wine bottle'
];

function normalize(drawing) {
  const [xs, ys] = drawing;

  const minX = _.min(xs);
  const minY = _.min(ys);
  const rangeX = _.max(xs) - minX;
  const rangeY = _.max(ys) - minY;
  const range = _.max([rangeX, rangeY]);

  return _.chain(_.zip(...drawing))
    .map(([x, y]) => [(x - minX) / range * 255, (y - minY) / range * 255]) // eslint-disable-line
    .unzip()
    .value();
}

function resultFromNetwork(result) {
  return _.chain(_.zip(result, categories))
    .filter(([score, category]) => score >= 0.1)
    .sortBy(([score, category]) => -score)
    .value();
}

const network = neataptic.Network.fromJSON(JSON.parse(fs.readFileSync(path.join(__dirname, 'neural-net.json')))); // prettier-ignore

function guess(drawing) {
  const normalizedDrawing = normalize(drawing);
  const stim = quickDraw._strokeToArray([normalizedDrawing], 28);
  const result = network.activate(stim);
  /* prettier-ignore */
  const options = resultFromNetwork(result);
  return { word: options[0][1], options, normalizedDrawing };
}

app.post('/api/guess', (req, res) => {
  const result = guess(req.body.drawing);
  res.json(result);
});

app.get('/', (req, res) => res.send('Opponent'));

/* prettier-ignore */
app.listen(port, host, () =>
  console.log(`Opponent listening on ${host}:${port}`)); // eslint-disable-line no-console
