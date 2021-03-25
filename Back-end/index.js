const app = require('./app');
const port = 3900 || process.env.PORT

app.listen(port, () => {
    console.log('server running!');
});



