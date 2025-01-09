const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Youtube API Documentation',
    version: '1.0',
    description: 'Access YouTube video data, playlists, and channel information through this API for seamless integration and management.',
    contact: {
      name: 'Mohd Zaid',
      email: 'razvizaid259@gmail.com'
    }
  },
  servers: [
    {
      url: 'https://yt-backend-six.vercel.app/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: `
          Use a valid JSON Web Token (JWT) for authorization.
          Format: Bearer <your-jwt-token>
        `,
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css';

const options = {
  swaggerDefinition,
  customCssUrl: CSS_URL,
  apis: ['./src/routes/user.routes.js', './src/routes/video.routes.js', './src/routes/playlist.routes.js', './src/routes/subscription.routes.js', './src/routes/like.routes.js', './src/routes/comment.routes.js', './src/routes/reply.routes.js',
  "./src/models/user.model.js", "./src/models/video.model.js", "./src/models/playlist.model.js", "./src/models/subscription.model.js", "./src/models/like.model.js", "./src/models/comment.model.js", "./src/models/reply.model.js"],
};

export { options }