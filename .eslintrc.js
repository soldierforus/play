module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'consistent-return': 0,
    'no-underscore-dangle': ['error', { 'allow': ['_json'] }]
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
