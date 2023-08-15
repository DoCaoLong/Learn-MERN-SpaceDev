export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync({ ...req.query, ...req.body });
      next();
    } catch (err) {
      next(err);
    }
  };
};
