const fs = require('fs');

let routes = [];
console.log(__dirname);

fs.readdirSync(__dirname).filter((file) => file !== 'index.js').forEach((file) => {
  /* eslint-disable global-require, import/no-dynamic-require */
  routes = routes.concat(require(`./${file}`));
  /* eslint-enable */
});

module.exports = routes;