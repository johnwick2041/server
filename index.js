const express = require('express');
require('dotenv').config()
const { connectDatabase } = require('./config/database');
const routes = require('./src/router');
const { errorHandler } = require('./src/middlewares/errorHandler');
const PORT = process.env.PORT || 3030;

const app = express();

require('./config/express')(app, express);

app.use('/api', routes);
app.use(errorHandler);
app.use('*', (req, res) => res.status(404).json({message: 'Not found!'}));

connectDatabase()
    .then(() => app.listen(PORT, () => console.log(`Database connected! Server listening on port ${PORT}! ...`)))
    .catch(err => {
        console.error('An error occured!');
        console.log(err);
    });