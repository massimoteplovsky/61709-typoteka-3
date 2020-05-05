'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const categoriesRoutes = require(`./routes/categories-routes`);
const {DefaultPort} = require(`../constants`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DefaultPort.FRONT_SERVER, () => {
  console.log(`Server is running on port: ${DefaultPort.FRONT_SERVER}`);
});

