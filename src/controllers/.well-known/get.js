module.exports = (req, res) => {
  const acmeToken = req.params.acmeToken;
  let acmeKey;

  if (process.env.ACME_KEY && process.env.ACME_TOKEN) {
    if (acmeToken === process.env.ACME_TOKEN) {
      acmeKey = process.env.ACME_KEY;
    }
  }

  for (const key in process.env) { // eslint-disable-line no-restricted-syntax
    if (key.startsWith('ACME_TOKEN_')) {
      const num = key.split('ACME_TOKEN_')[1];
      if (acmeToken === process.env[`ACME_TOKEN_${num}`]) {
        acmeKey = process.env[`ACME_KEY_${num}`];
      }
    }
  }

  if (acmeKey) res.send(acmeKey);
  else res.status(404).send();
};
