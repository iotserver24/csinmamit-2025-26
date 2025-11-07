export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  const isDevelopment = process.env.NODE_ENV !== 'production'

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(isDevelopment && { stack: err.stack }),
    ...(isDevelopment && { error: err })
  })
}

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}
