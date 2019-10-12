const express = require('express');
const app = express();

const fileRouter = require('./routers/file');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/files', fileRouter);

app.listen(3000, function (e) {
    console.log("It is works");
});
module.exports = app;