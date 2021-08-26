const {generateNodeForTesting} = require('../class/mock')
const generatedNodes = generateNodeForTesting(10000)
const mock = (req, res, next) => {
    const count = req.query.count || 5000
    if (count > 10000) return
    const nodes = generatedNodes.slice(0, count)
    res.status(200).send(nodes);
}

module.exports = mock;
