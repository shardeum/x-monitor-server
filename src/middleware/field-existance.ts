const FieldExistance =
  (fields = []) =>
  (req, res, next) => {
    let _field;
    let missing = fields.some((field) => {
      _field = field;
      return !req.body.hasOwnProperty(field);
    });
    if (missing) {
      let error = new Error(`${_field} is required`);
      return next(error);
    }
    next();
  };

module.exports = FieldExistance;
