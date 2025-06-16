const express = require('express');
const app = express();
const PORT = 3000;

// 访问计数器对象
let visitCounts = {};
// IP黑名单数组
const blacklistedIPs = ['192.168.1.100', '10.0.0.5']; // 示例黑名单IP

// 基础任务：访问计数器中间件
app.use((req, res, next) => {
    const ip = req.ip;
    
    // 挑战任务：IP黑名单检查
    if (blacklistedIPs.includes(ip)) {
        return res.status(403).send('您的IP已被列入黑名单 🚫');
    }
    
    // 计数逻辑
    if (!visitCounts[ip]) {
        visitCounts[ip] = 0;
    }
    visitCounts[ip]++;
    
    console.log(`IP ${ip} 访问次数: ${visitCounts[ip]}`);
    next();
});

// 基础路由
app.get('/', (req, res) => {
    res.send(`
        <h1>欢迎来到Express服务器 🚀</h1>
        <p>您的IP ${req.ip} 已访问 ${visitCounts[req.ip] || 0} 次</p>
    `);
});

// 彩蛋路由
app.get('/secret', (req, res) => {
    res.json({
        message: '恭喜发现彩蛋 🥚',
        yourIP: req.ip,
        visitCount: visitCounts[req.ip] || 0
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('试试这些路由:');
    console.log(`http://localhost:${PORT}/`);
    console.log(`http://localhost:${PORT}/secret`);
});