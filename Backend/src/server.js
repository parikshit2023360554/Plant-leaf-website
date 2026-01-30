const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env files with precedence: .env -> .env.<env> -> .env.local
(() => {
  const env = process.env.NODE_ENV || 'development';
  const root = path.join(__dirname, '..');
  const files = [
    path.join(root, '.env'),
    path.join(root, `.env.${env}`),
    path.join(root, '.env.local')
  ];
  for (const file of files) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file, override: true });
    }
  }
})();

const app = require('./app');
const config = require('./config');

const port = config.port;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});