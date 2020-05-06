'use strict';

const path = require(`path`);
const express = require(`express`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const categoriesRoutes = require(`./routes/categories-routes`);
const {
  PUBLIC_DIR,
  DefaultPort
} = require(`../constants`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/categories`, categoriesRoutes);
app.use((req, res) => res.status(400).render(`errors/400`));
app.use((err, req, res) => res.status(500).render(`errors/500`));

app.listen(DefaultPort.FRONT_SERVER, () => {
  console.log(`Server is running on port: ${DefaultPort.FRONT_SERVER}`);
});

