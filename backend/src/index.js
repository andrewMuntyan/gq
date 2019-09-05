// set env variables up
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const dotenvPath = path.resolve(process.cwd(), 'variables.env');
const myEnv = dotenv.config({ path: dotenvPath });
dotenvExpand(myEnv);

const cookieParser = require('cookie-parser');

// create yoga server
const createServer = require('./createServer');
// const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// TODO: use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: [process.env.FRONTEND_URL, process.env.PLAYGROUND_URL],
    },
  },
  (deets) => {
    // eslint-disable-next-line no-console
    console.log(`Server is now running on http://localhost:${deets.port}`);
  },
);
