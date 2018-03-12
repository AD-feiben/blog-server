module.exports = () => {
  return async (ctx, next) => {
    console.log('\x1b[36m', `[${ctx.method.toUpperCase()}]${ctx.host}${ctx.url}`)
    const req = ctx.method.toUpperCase() === 'GET' ? ctx.request.query : ctx.request.body
    Object.keys(req).forEach(key => {
      console.log(`${key}=${req[key]}`)
    })
    await next()
  }
}
