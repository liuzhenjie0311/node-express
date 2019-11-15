const utility = require('utility')
const express = require('express')
const app = express()
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})
app.get('/getksdata', (req, res) => {
    let res_q = req.query.q
    console.log(res_q)
    res_q = utility.md5(res_q)
    res.send(res_q)
})
app.listen(3000, () => {
    console.log('监听3000端口')
})