module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'app/**/*.js',
    'components/**/*.js',
    'pages/**/*.js',
    '!app/**/_*.js',
    '!components/**/_*.js',
    '!**/Xstore.js',
  ],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/app/libs/transformer/assets.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/.next',
  ],
};
