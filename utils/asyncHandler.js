const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    try {
      Promise.resolve(requestHandler(req, res, next))
        .catch(next); // async errors
    } catch (error) {
      next(error);   // sync errors
    }
  };
};

export default asyncHandler;
