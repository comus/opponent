const quickDraw = require('quickdraw.js');
const neataptic = require('neataptic');
const fs = require('fs');
const path = require('path');

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
  'wine bottle',
];

const dataSet = quickDraw.set(categories.length * 100, categories);

const network = new neataptic.architect.Perceptron(
  dataSet.input,
  30,
  dataSet.output,
);

network.train(dataSet.set, {
  iterations: 100,
  log: 1,
  rate: 0.1,
});

const neuralNet = JSON.stringify(network.toJSON());

fs.writeFile(path.join(__dirname, 'neural-net.json'), neuralNet, () =>
  console.log('Done training neural net')); // prettier-ignore
