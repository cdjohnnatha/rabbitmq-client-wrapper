module.exports = {
  "root": true,
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true,
    "jquery": false,
    "jest": true,
    "jasmine": true,
  },
  "extends": "airbnb",
  "parserOptions": {
    "sourceType": "module"
  },
  "globals": {
    "describe": true,
    "expect": true,
    "should": true,
    "done": true,
    "DataTypes": true,
  }

};