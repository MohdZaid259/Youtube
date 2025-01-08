import serverless from 'serverless-http';
import app from './src/index.js'; 

const handler = serverless(app);

export default handler;