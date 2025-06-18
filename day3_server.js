// 导入Node.js内置的http模块，用于创建HTTP服务器
const http = require('http');
// 导入url模块，用于解析URL
const url = require('url');

// 用 对象 存储 每日抽奖记录，结构为 {日期: [用户名1, 用户名2]}
const dailyLotteryRecords = {};

// 创建HTTP服务器
// req - 请求对象，包含客户端请求信息、 res - 响应对象，用于向客户端返回数据
const server = http.createServer((req, res) => {
    
    const parsedUrl = url.parse(req.url, true);   // 解析URL，true表示同时解析查询参数
   
    const pathname = parsedUrl.pathname;     // 获取URL路径部分
   
    const query = parsedUrl.query;     // 获取查询参数对象

    // 路由处理
    if (pathname === '/') {
       
        res.writeHead(200, {'Content-Type': 'text/html'});    // 设置响应头：状态码200，内容类型为HTML
       
        res.end('<h1>欢迎来到幸运数字生成器 🎲</h1>');     // 返回HTML格式的欢迎页面
        
    } else if (pathname === '/lucky') {
       
        handleLuckyNumber(res, query);    // 处理/lucky路径的请求
    } else {
        // 其他路径返回404错误
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 页面未找到 🚧');
    }
});

// 处理幸运数字请求
// res - 响应对象、query - 包含查询参数的对象
function handleLuckyNumber(res, query) {
    // 从查询参数获取name，默认为"神秘人"
    const name = query.name || '神秘人';
    // 获取当前日期，格式为YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // 检查用户当天是否已抽过奖
    if (dailyLotteryRecords[today]?.includes(name)) {
        // 返回JSON格式的错误信息
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            error: `${name}今天已经抽过奖了，明天再来吧！`
        }));
        return;
    }

    // 生成1-100的随机整数
    const luckyNumber = Math.floor(Math.random() * 100) + 1;
    
    // 记录抽奖信息
    if (!dailyLotteryRecords[today]) {
        dailyLotteryRecords[today] = [];
    }
    dailyLotteryRecords[today].push(name);

    // 返回JSON格式的幸运数字结果
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        name: name,
        luckyNumber: luckyNumber,
        message: `${name}的幸运数字是: ${luckyNumber}`
    }));
}

// 启动服务器，监听3000端口
server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
    console.log('试试这些URL:');
    console.log('http://localhost:3000/lucky?name=张三');
    console.log('http://localhost:3000/lucky?name=李四');
});