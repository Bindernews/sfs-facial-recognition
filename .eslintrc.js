module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": true
    },
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-max-props-per-line": [0],
        "react/jsx-first-prop-new-line": [0],
        "react/jsx-closing-bracket-location": [0],
        "linebreak-style": [0],
    },
    "globals": {
        "MOCK": false,
    },
};