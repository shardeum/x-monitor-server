const {generateNodeForTesting} = require('../class/mock')
const mock = (req, res, next) => {
    const count = req.query.count || 5000
    const width = req.query.width || 900
    const height = req.query.height || 900
    const nodes = generateNodeForTesting(count)
    res.status(200).send(nodes);
}

module.exports = mock;
