const { NotFoundError } = require("../errors");

const routeNotFoundMiddleware = (req, res) => {
  throw new NotFoundError("Route does not exist");
};

module.exports = routeNotFoundMiddleware;
