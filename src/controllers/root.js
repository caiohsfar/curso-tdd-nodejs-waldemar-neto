const { version, name, description } = require('../../package.json')
export default class RootController {
    index(req, res) {
        res.send({ version, name, description })
    }
}