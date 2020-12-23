const app = require('express')()
//const proxy = require('http-proxy-middleware')
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan')
const applyCors = require('./cors')
const process = require('process')
// ignored to quick make it work for Des - const twilioCallMe = require('./twilio-call-me')

console.log('Node version:', process.versions.node)

app.use(morgan('combined'))

applyCors(app)
// ignored to quick make it work for Des - twilioCallMe(app)

app.options('*', function (req, res, next) {
    res.end('OPTIONS calls are being blocked Node.')
})

// Allianz Direct
// app.use('/sbp', proxy({target: 'http://test-allianz-direct.apps.crp.ec1.aws.aztec.cloud.allianz/', changeOrigin: true, secure: false}))
// app.use('/fnol-bff', proxy({target: 'http://fnol-bff-test.apps.crp.ec1.aws.aztec.cloud.allianz/', pathRewrite: { '^/fnol-bff': '/' }, changeOrigin: true, secure: false}))
// app.use('/fnol-bff-dev', proxy({target: 'http://fnol-bff-dev.apps.crp.ec1.aws.aztec.cloud.allianz/', pathRewrite: { '^/fnol-bff-dev': '/' }, changeOrigin: true, secure: false}))
// app.use('/mo-bff', proxy({target: 'http://mo-bff-dev.apps.crp.ec1.aws.aztec.cloud.allianz/', pathRewrite: { '^/mo-bff': '/' }, changeOrigin: true, secure: false}))
// app.use('/portal-bff', proxy({target: 'http://portal-bff-test.apps.crp.ec1.aws.aztec.cloud.allianz/', pathRewrite: { '^/portal-bff': '/' }, changeOrigin: true, secure: false}))
// app.use('/portal-bff-dev', proxy({target: 'http://portal-bff-dev.apps.crp.ec1.aws.aztec.cloud.allianz/', pathRewrite: { '^/portal-bff-dev': '/' }, changeOrigin: true, secure: false}))
// app.use('/config', proxy({target: 'http://config-service-dev.apps.crp.ec1.aws.aztec.cloud.allianz/', changeOrigin: true, secure: false}))
// app.use('/client-state', proxy({target: 'http://state-service-azdir-dev.apps.crp.ec1.aws.aztec.cloud.allianz/', changeOrigin: true, secure: false}))

// Proxy for FNOL team to reach the Swiss CISL
//app.use('/cisl-swiss', proxy({
//    target: 'https://lx-kong01.aeat.allianz.at:8443/109/',
//    pathRewrite: {'^/cisl-swiss': '/'},
//    changeOrigin: true,
//    secure: false
//}))

// Secured Proxy for the ITMP CISL
app.use((req, res, next) => {
    // 'API_KEYS_CISL_ITMP' env variable. for example: "auth_key1, auth_key2, auth_key3"
    const apiKeysConfig = process.env['API_KEYS_CISL_ITMP'].replace(/\s/g, '').split(",");
    const apiKeyHeader = req.header('API_KEY_CISL_ITMP');
    if (!apiKeysConfig.includes(apiKeyHeader)) {
        console.log(" API key supplied invalid");
        return res.send('ERROR');
    } else return next();
});

const createProxy = (path, target) => {
    return [
        path,
        createProxyMiddleware({
            target: target,
            pathRewrite: {['^' + path]: '/'},
            changeOrigin: true,
            secure: false,
			proxyTimeout: 10800,
			timeout: 10800
        })
    ]
};


app.use(...createProxy('/cisl-itmp', 'https://cisl-it-master-platform-dev.apps.crp.ec1.aws.aztec.cloud.allianz/itmp.allianz.abs.cisl.adapter/services'));
app.use(...createProxy('/cisl-itmp-dev', 'https://cisl-it-master-platform-dev.apps.crp.ec1.aws.aztec.cloud.allianz/itmp.allianz.abs.cisl.adapter/services'));
app.use(...createProxy('/cisl-itmp-test', 'https://cisl-it-master-platform-test.apps.crp.ec1.aws.aztec.cloud.allianz/itmp.allianz.abs.cisl.adapter/services'));
app.use(...createProxy('/cisl-itmp-demo', 'https://cisl-it-master-platform-demo.apps.crp.ec1.aws.aztec.cloud.allianz/itmp.allianz.abs.cisl.adapter/services'));
app.use(...createProxy('/cisl-itmp-hotfix', 'https://cisl-it-master-platform-hotfix.apps.crp.ec1.aws.aztec.cloud.allianz/itmp.allianz.abs.cisl.adapter/services'));
app.use(...createProxy('/cisl-gis-dev', 'https://dev-cisl-gis-adapter-cisl.apps.tools.adp.allianz/api'));
applyCors(app)

app.listen(8080)

