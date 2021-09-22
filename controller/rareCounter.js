const rareCounter = (req, res, next) => {
    let Node = global.node;
    let shouldAggregate = req.query.aggregate ? true : false
    let rareCounter = Node.getRareEventCounters(shouldAggregate);
    res.status(200).send(rareCounter);
}

module.exports = rareCounter;
