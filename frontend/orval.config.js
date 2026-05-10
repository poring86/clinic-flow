module.exports = {
  api: {
    input: 'http://localhost:3333/api-json',
    output: {
      mode: 'tags-split',
      target: './src/api/generated/',
      schemas: './src/api/schemas/',
      client: 'react-query',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write ./src/api/generated',
    },
  },
};
