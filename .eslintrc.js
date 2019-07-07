module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "rules": {
      "no-undef": ["warn"],
      "no-unused-vars": ["warn"],
      "indent": ["error", 4],
      "object-curly-spacing": ["error", "always"]
    }
};