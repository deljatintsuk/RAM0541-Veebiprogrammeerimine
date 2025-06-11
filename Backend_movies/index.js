const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();
const models = require('./models/init-models');

const authRoutes = require('./routes/authRoutes');
const actorRoutes = require('./routes/actorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const filmRoutes = require('./routes/filmRoutes');
const languageRoutes = require('./routes/languageRoutes');
const filmActorRoutes = require('./routes/filmActorRoutes');
const filmCategoryRoutes = require('./routes/filmCategoryRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const searchMovieRoutes = require('./routes/searchMovieRoutes.js');


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/film-actors', filmActorRoutes);
app.use('/api/film-categories', filmCategoryRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/searchmovie', searchMovieRoutes);


require('./swagger.js')(app);

app.get('/', (req, res) => {
  res.send('API töötab!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});