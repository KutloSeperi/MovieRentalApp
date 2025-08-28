const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error:', err.message);

  // Handle Mongoose validation errors (e.g. required fields, enum)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Failed',
      details: err.message
    });
  }

  // Handle duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Conflict: Duplicate field',
      details: `${field} already exists.`
    });
  }

  // Handle CastError (invalid ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }

  // Default 500 error
  res.status(500).json({
    error: 'Something went wrong on the server.',
    message: err.message
  });
};

module.exports = errorHandler;