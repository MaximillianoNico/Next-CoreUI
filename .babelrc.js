module.exports = {
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {
          "modules": "commonjs"
        }
      }
    ],
  ],
  "plugins": [
    ["babel-plugin-root-import"],
    // ["transform-remove-console"],
    [ "inline-react-svg" ],

    ["styled-components", { "ssr": true, "displayName": true, "preprocess": false } ],
    // Module resolver
    ["module-resolver", {
      "root": ["./app"],
      "alias": {
        "@containers": "./app/containers",
        "@components": "./app/components",
        "@layout":"./app/layout",
        "@redux": "./app/redux",
        "@helper": "./utils",
        "@libs":"./lib",
        "@utils":"./utils",
        "@assets":"./static/assets",
        "@styles":"./static/styles"
      }
    }]
  ],
  "env": {
    "development": {
      "plugins": ["inline-dotenv", "dynamic-import-node"],
      "presets": [["next/babel", { "preset-env": { "modules": "commonjs" } }]]
    },
    "production": {
      "plugins": [["transform-inline-environment-variables"],["transform-remove-console"]]
    },
    "test": {
      "presets": [["next/babel", { "preset-env": { "modules": "commonjs" } }]]
    }
  }
}
