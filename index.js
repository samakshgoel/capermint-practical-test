require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const socket = require('socket.io');
const socketEvents = require('./services/socketEvents');

const app = express();
const models = require('./models');
const PORT = process.env.PORT || 5000;


app.use(require('cors')())
app.use(express.json());
app.use(morgan('dev'));

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const USER_ROUTES = require('./routes/user');
const CATEGORY_ROUTES = require('./routes/category');
const PRODUCT_ROUTES = require('./routes/product');

/**Task - 1 */
app.use('/user', USER_ROUTES);

/**Task - 2 */
app.use('/category', CATEGORY_ROUTES);
app.use('/product', PRODUCT_ROUTES);

/**Task - 3 */

app.get('/real-time-chat', (req, res) => {
    res.render('index', { name: 'Task 3' })
})

models.db_config
    .sync({
        // force: true,
        // alter: true,
    })
    .then(() => {
        console.log(`Connected to Database!`);
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err)
        process.exit()
    });


const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

const io = socket(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

socketEvents(io)