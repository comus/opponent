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
  'aircraft carrier',
  'airplane',
  'alarm clock',
  'ambulance',
  'angel',
  'animal migration',
  'ant',
  'anvil',
  'apple',
  'arm',
  'asparagus',
  'axe',
  'backpack',
  'banana',
  'bandage',
  'barn',
  'baseball',
  'baseball bat',
  'basket',
  'basketball',
  'bat',
  'bathtub',
  'beach',
  'bear',
  'beard',
  'bed',
  'bee',
  'belt',
  'bench',
  'bicycle',
  'binoculars',
  'bird',
  'birthday cake',
  'blackberry',
  'blueberry',
  'book',
  'boomerang',
  'bottlecap',
  'bowtie',
  'bracelet',
  'brain',
  'bread',
  'bridge',
  'broccoli',
  'broom',
  'bucket',
  'bulldozer',
  'bus',
  'bush',
  'butterfly',
  'cactus',
  'cake',
  'calculator',
  'calendar',
  'camel',
  'camera',
  'camouflage',
  'campfire',
  'candle',
  'cannon',
  'canoe',
  'car',
  'carrot',
  'castle',
  'cat',
  'ceiling fan',
  'cello',
  'cell phone',
  'chair',
  'chandelier',
  'church',
  'circle',
  'clarinet',
  'clock',
  'cloud',
  'coffee cup',
  'compass',
  'computer',
  'cookie',
  'cooler',
  'couch',
  'house',
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
