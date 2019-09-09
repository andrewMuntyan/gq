// set env variables up
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const dotenvPath = path.resolve(process.cwd(), 'variables.env');
const myEnv = dotenv.config({ path: dotenvPath });
dotenvExpand(myEnv);

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// create yoga server
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// Decode JWT we can get userId on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// Create middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  const { userId } = req;
  // if they arent logged just skip
  if (!userId) {
    return next();
  }
  const user = await db.query.user(
    { where: { id: userId } },
    '{id, permissions, email, name}',
  );

  req.user = user;
  return next();
});

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
