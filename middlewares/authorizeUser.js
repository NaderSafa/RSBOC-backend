// Authorize user for specific action
export const authorizeUser = (role) => {
  return (req, res, next) => {
    try {
      if (Array.isArray(role) && role.includes(req.currentUser.role))
        return next()
      else if (req.currentUser.role !== role && role !== 'all')
        return res.status(403).json({
          message: `Permission denied`,
        })

      next()
    } catch (err) {
      console.log(err)
      console.log('Catch - authorizeUser - middlewares')

      res.status(400).json({
        message: 'Something went wrong',
      })
    }
  }
}
