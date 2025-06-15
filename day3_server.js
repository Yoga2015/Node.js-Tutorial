const http = require('http');
const url = require('url');

// 用对象存储每日抽奖记录
const dailyLotteryRecords = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // 路由处理
    if (pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>欢迎来到幸运数字生成器 🎲</h1>');
    } else if (pathname === '/lucky') {
        handleLuckyNumber(res, query);
    }else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 页面未找到 🚧');
    }
});

function handleLuckyNumber(res, query) {
    const name = query.name || '神秘人';
    const today = new Date().toISOString().split('T')[0]; // 获取当前日期
    
    // 挑战任务：检查当日是否已抽过奖
    if (dailyLotteryRecords[today]?.includes(name)) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            error: `${name}今天已经抽过奖了，明天再来吧！`
        }));
        return;
    }

    // 生成1-100的随机数
    const luckyNumber = Math.floor(Math.random() * 100) + 1;
    
    // 记录抽奖
    if (!dailyLotteryRecords[today]) {
        dailyLotteryRecords[today] = [];
    }
    dailyLotteryRecords[today].push(name);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        name: name,
        luckyNumber: luckyNumber,
        message: `${name}的幸运数字是: ${luckyNumber}`
    }));
}

server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
    console.log('试试这些URL:');
    console.log('http://localhost:3000/lucky?name=张三');
    console.log('http://localhost:3000/lucky?name=李四');
});