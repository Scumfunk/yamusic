module.exports = {
    "env": {
        "commonjs": true,
        "node": true,
        "mocha": true,
        "es6": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2019,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true,
            "impliedStrict": true
        }
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "rules": {
      "no-undef": ["off"],
      "no-unused-vars": ["warn"],
      "indent": ["error", 4],
      "object-curly-spacing": ["error", "always"],
      "semi": ["error", "always"]
    }
};