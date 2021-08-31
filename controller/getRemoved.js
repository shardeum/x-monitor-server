const removed = (req, res, next) => {
    const nodeId = req.body.nodeId;
    let Node = global.node;
    let removed = Node.getRemoved();
    res.status(200).send({removed});
  }
  
  module.exports = removed;