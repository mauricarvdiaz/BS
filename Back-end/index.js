const app = require('./app');
const port = 3900

app.get('/', (req, res) => {
    res.send('hola');
})

app.listen(process.env.PORT, () => {
    console.log('server running!');
});



