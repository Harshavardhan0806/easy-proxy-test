const request = require("request")

const apiTwilio = (number, name, url) => new Promise(cb => {
    var options = {
        method: 'POST',
        url: 'https://taskrouter.twilio.com/v1/Workspaces/WS57d576fa37dbba7117d7eccfbde44592/Tasks',
        json: true,
        headers: {
            'cache-control': 'no-cache,no-cache',
            'Postman-Token': '836f67a4-6aa4-4646-adbf-87cd1aa17e21,452d7768-64cd-415d-8499-eff981e59299',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic QUM3ZTM1Njk5MjFhZjVjODc3YjhmNTU5NjAzZDNmMjBkYzplYmEzODFiZjc5MGZlOTVmMjgyZDVjNTUyM2QyMWE5Mw=='
        },
        form: {
            Attributes: `{"to": "+${number}","direction": "outbound","name": "${name}","url":"${url}"}`,
            WorkflowSid: 'WWb635356882d6b7e16453842c7b0c5c82',
            TaskChannel: 'TCfc008d8e67907dfbc0887b728f5cf458',
            undefined: ['', undefined]
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        return cb(body)
    });
})

module.exports = app => {
    app.get('/twilio-call-me', async (req, res, next) => {
        try {
            const number = req.query.number
            const name = req.query.name || 'Steven Eubank'
            const url = req.query.url
            const stateId = req.query.stateId
            const lang = req.query.lang

            if (!number || number.length < 6)
                throw new Error(`invalid number: ${number}`)

            if (!url || url.length < 6)
                throw new Error(`invalid url: ${url}`)

            if (!stateId || stateId.length < 50)
                throw new Error(`invalid stateId: ${stateId}`)

            const fullUrl = `${url}?lang=${lang}&stateId=${stateId}`
            const twilioAnswer = await apiTwilio(number, name, fullUrl)

            res.json(twilioAnswer)
        } catch (e) {
            res.status(401).end(e.message)
        }
    })
}