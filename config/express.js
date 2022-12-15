const cors = require('cors');
module.exports = (app, express) => {
    app.use(cors({ credentials: true }));
    app.use(express.json());
}