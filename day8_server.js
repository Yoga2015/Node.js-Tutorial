const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// 错误日志文件路径
const ERROR_LOG_PATH = 'error.log';

// 中间件：记录错误日志到文件
app.use((err, req, res, next) => {
    // err: 错误对象、next: 下一个中间件函数
    
    const errorLog = `[${new Date().toISOString()}] ${err.stack || err.message}\n`;
    
    // 异步写入错误日志
    fs.appendFile(ERROR_LOG_PATH, errorLog, (fileErr) => {
        if (fileErr) console.error('写入日志失败:', fileErr);
    });
    
    next(err); // 传递给下一个错误处理中间件
});

// 模拟404错误的路由
app.get('/not-found', (req, res, next) => {
    // 故意抛出404错误
    const err = new Error('页面未找到');
    err.status = 404;
    next(err);
});

// 模拟500错误的路由
app.get('/server-error', (req, res, next) => {
    // 故意抛出500错误
    throw new Error('服务器内部错误');
});

// 自定义错误处理中间件
app.use((err, req, res, next) => {
    // 设置默认状态码
    const statusCode = err.status || 500;
    
    // 根据错误类型返回不同的响应
    if (statusCode === 404) {
        // 404错误页面 - 显示恐龙图案
        res.status(404).send(`
            <h1>404 页面未找到 🦖</h1>
            <pre>${err.message}</pre>
            <div style="font-size: 5rem;">🦕</div>
        `);
    } else {
        // 500错误页面
        res.status(500).send(`
            <h1>500 服务器错误 💥</h1>
            <pre>${err.message}</pre>
            <p>错误已记录到日志</p>
        `);
    }
});

app.get('/', (req, res) => {
    res.send(`
        <h1>错误处理演示</h1>
        <ul>
            <li><a href="/not-found">触发404错误</a></li>
            <li><a href="/server-error">触发500错误</a></li>
        </ul>
    `);
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('可以测试以下端点:');
    console.log(`http://localhost:${PORT}/not-found`);
    console.log(`http://localhost:${PORT}/server-error`);
});