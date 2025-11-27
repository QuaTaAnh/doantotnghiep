require('@babel/register')({
  extensions: ['.js'],
  presets: ['@babel/preset-env']
});

require('./index.js');

