module.exports = {
  extends: 'airbnb',
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'consistent-return': 0
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  'plugins': [
      'import'
  ],
};
