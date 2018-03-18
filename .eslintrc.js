module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'max-len': [1, 120, 2, { 'ignoreComments': true }],
    'quote-props': [1, 'consistent-as-needed'],
    'radix': 0,
    'no-param-reassign': [2, {'props': false }],
    'no-bitwise': 0,
    'no-plusplus': [2, { 'allowForLoopAfterthoughts': true }],
    'import/no-unresolved': 0,
    'import/extensions': 0,
  },
  globals: {},
}
