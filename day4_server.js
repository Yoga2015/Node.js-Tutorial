// 导入express框架
const express = require('express');
// 创建express应用实例
const app = express();
// 定义服务器端口号
const PORT = 3000;

// 访问计数器对象，用于存储每个IP的访问次数
let visitCounts = {};
// IP黑名单数组，包含被禁止访问的IP地址
const blacklistedIPs = ['192.168.1.100', '10.0.0.5']; // 示例黑名单IP

// 注册全局中间件，对所有请求生效
// req - 请求对象，包含客户端请求信息 、 res - 响应对象，用于向客户端返回数据
// next - 函数，调用后将控制权交给下一个中间件
app.use((req, res, next) => {
    // 获取客户端IP地址
    const ip = req.ip;
    
    // 检查当前IP是否在黑名单中
    if (blacklistedIPs.includes(ip)) {
        // 返回403禁止访问状态码和提示信息
        return res.status(403).send('您的IP已被列入黑名单 🚫');
    }
    
    // 初始化该IP的访问计数
    if (!visitCounts[ip]) {
        visitCounts[ip] = 0;
    }
    // 增加该IP的访问计数
    visitCounts[ip]++;
    
    // 在控制台打印访问日志
    console.log(`IP ${ip} 访问次数: ${visitCounts[ip]}`);
    // 调用next()将控制权交给下一个中间件
    next();
});

// 定义根路由的GET请求处理
app.get('/', (req, res) => {
    // 返回HTML格式的响应，显示欢迎信息和访问次数
    res.send(`
        <h1>欢迎来到Express服务器 🚀</h1>
        <p>您的IP ${req.ip} 已访问 ${visitCounts[req.ip] || 0} 次</p>
    `);
});

// 定义/secret路由的GET请求处理
app.get('/secret', (req, res) => {
    // 返回JSON格式的响应，包含彩蛋信息
    res.json({
        message: '恭喜发现彩蛋 🥚',
        yourIP: req.ip,
        visitCount: visitCounts[req.ip] || 0
    });
});

// 启动服务器监听指定端口
// PORT - 监听的端口号
// 回调函数 - 服务器启动后执行
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('试试这些路由:');
    console.log(`http://localhost:${PORT}/`);
    console.log(`http://localhost:${PORT}/secret`);
});