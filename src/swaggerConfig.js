const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Youtube Api',
    version: '1.0.0',
    description: 'API documentation for the youtube project'
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.routes.js'],
};

export { options }