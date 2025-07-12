const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000", //配置转发目标地址(能返回数据的服务器地址)
      changeOrigin: true, //控制服务器接收到的请求头中host字段的值
      ws: false, //是否代理websockets
      pathRewrite: { "^/api": "" }, //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
    })
  )

  app.use(
    "/tool",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      ws: false,
      pathRewrite: { "^/tool": "" },
    })
  )
}