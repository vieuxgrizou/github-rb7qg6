const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.type === 'validation') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler;