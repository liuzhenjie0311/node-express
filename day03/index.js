// 高阶爬虫，获取链接进行访问
const express = require('express')
const app = express()
const cheerio = require('cheerio')
const superagent = require('superagent')
const eventproxy = require('eventproxy')
const ep = new eventproxy()
app.get('/', function (req, res, next) {
    superagent.get('https://www.csdn.net/')
    .end(function (_err, _res) {
        // 常规的错误处理
        if (_err) { 
            return next(_err)
        }
        const $ = cheerio.load(_res.text)
        const arr = []
        // 获取所有标题连接
        $('.feedlist_mod .clearfix').map((i, dom) => {
            let href = $(dom).find('div.title>h2>a').attr('href')
            if (!href) {
                return
            }
            arr.push(href)
            // 请求连接，获取内容
            superagent.get(href)
            .end(function (e_err, e_res) {  
                ep.emit('getHtml',e_res.text)
            })
        });
        ep.after('getHtml', arr.length, function (list) {
            const data = []
            // 处理请求后的内容
            list.map(item => {
                const _$ = cheerio.load(item)
                // 目标：获取作者名称，获取阅读量，获取标题，获取第一条评论
                const name = _$('.follow-nickName').text()
                const num = _$('.read-count').text().split(' ')[1]
                const title = _$('.article-title-box .title-article').text()
                const comment = _$('.comment-box .comment-list-container .comment-list li .right-box .new-comment').text()
                data.push({
                    name: name,
                    num: num,
                    title: title,
                    comment:comment
                })
            })
            res.send(data)
        })
    })
})
app.listen(3000, function () {
    console.log('启动')
})