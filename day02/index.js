

const express = require('express')
const cheerio = require('cheerio')
const superagent = require('superagent')
const app = express()
// 编写简单爬虫
app.get('/', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://www.csdn.net/')
    .end(function (err, _res) {
        // 常规的错误处理
        if (err) { 
            return next(err)
        }
        // _res.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是 jquery 的内容了
        const $ = cheerio.load(_res.text)
        const arr = []
        $('.feedlist_mod .clearfix').map((i, dom) => {
            const title = $(dom).find('div.title>h2>a').text()
            const text = $(dom).find('.list_userbar .name>a').text() || $(dom).find('div.summary.oneline').text()
            arr.push({
                title: title,
                text:text
            })
        });
        console.log(arr)
        next()
    })
})
app.listen(3000, function (res) {
    console.log('成功')
})