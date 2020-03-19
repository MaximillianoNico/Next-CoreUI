/* eslint-disable array-callback-return */
const express = require('express');
const next = require('next');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const routes = require('../routes');

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    server.use(compression());
    server.use(express.static('static'));
    server.use(express.static(path.join(__dirname, 'locales')));
    server.use(cookieParser());
    server.use((req, res, nex) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      nex();
    });

    routes.map((v) => {
      server.get(
        `${v.slug}`,
        (req, res) => app.render(req, res, `${v.path}`, Object.assign({}, req.query, req.param)),
      );
    });

    server.get('/service-worker.js', (req, res) => {
      res.sendFile(`${path.resolve(__dirname, '.', 'static')}/service-worker.js`);
    });
    server.get('*', (req, res) => handle(req, res));

    server.listen(process.env.APP_PORT || 3333, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${process.env.APP_PORT || 3333}`);
      console.log('> route list ', routes);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
