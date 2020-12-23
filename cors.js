module.exports = app => {
    app.use('*', function (req, res, next) {
        res.header("Access-Control-Request-Method", "GET, POST, PUT, OPTIONS");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next()
    })
}
