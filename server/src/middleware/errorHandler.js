export function notFound(req, res) {
  return res.status(404).json({ success: false, message: 'Route not found' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error.name === 'ValidationError') {
    const firstValidationError = Object.values(error.errors)[0]
    return res.status(400).json({
      success: false,
      message: firstValidationError.message,
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${error.path}`,
    })
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Request body must be valid JSON',
    })
  }

  console.error(error)
  return res.status(500).json({ success: false, message: 'Internal server error' })
}