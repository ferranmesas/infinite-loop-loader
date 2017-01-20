# infinite-loop-loader
[![Build Status](https://travis-ci.org/nickbalestra/infinite-loop-loader.svg?branch=master)](https://travis-ci.org/nickbalestra/infinite-loop-loader)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A webpack 2 loader to transform ∞ loops so that they throw

Before:

```JavaScript
while(true){
  // your logic here
}
```

After:

```JavaScript
var __ITER = 1000000000; 
while(true) {
  if (__ITER <= 0) { 
    throw new Error("Loop exceeded maximum allowed iterations");
  }
  // your logic here
  __ITER--;
}
```

## Installation

```bash
npm install --save-dev infinite-loop-loader
```

## Usage

Webpack config example

```JavaScript
...
module: {
      rules: [
        {
          test: /\.js?$/,
          use: [
            loader: 'infinite-loop-loader',
            options: {
              // iteration limit
              limit: 10000,
              // falafel -> acorn options
              opts {
                allowImportExportEverywhere: true
              }
            }
          ]
        }
      ],
      ...
    }
...
```
