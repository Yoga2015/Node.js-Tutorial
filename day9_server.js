const cluster = require('cluster');     // Node.js集群模块
const os = require('os');              
const express = require('express'); 
const process = require('process');     // 进程模块

// 获取CPU核心数
const numCPUs = os.cpus().length;

// 如果是主进程
if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);
    
    // 1.创建与CPU核心数相同的工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); // 创建工作进程
    }
    
    // 监听工作进程退出事件
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出，代码: ${code}, 信号: ${signal}`);
        // 自动重启工作进程
        cluster.fork();
    });
    
    // 2. 添加内存监控
    setInterval(() => {

        // 遍历所有工作进程
        for (const id in cluster.workers) {
            const worker = cluster.workers[id];
            // 获取进程内存使用情况(RSS: 常驻内存大小)
            const memoryUsage = process.memoryUsage().rss / (1024 * 1024);
            console.log(`工作进程 ${worker.process.pid} 内存使用: ${memoryUsage.toFixed(2)} MB`);
        }

    }, 5000); 
    
} else {

    // 工作进程代码   
    const app = express();
    const PORT = 3000;
    
    // 3. 对比性能差异的路由    
    app.get('/heavy-task', (req, res) => {

        // 模拟CPU密集型任务
        let result = 0;
        for (let i = 0; i < 1e7; i++) {
            result += Math.random();
        }
        res.send(`计算结果: ${result.toFixed(2)} (由进程 ${process.pid} 处理)`);
    });
    
    // 轻量级路由对比
    app.get('/light-task', (req, res) => {
        res.send(`快速响应 (由进程 ${process.pid} 处理)`);
    });
    
    // 启动服务器
    app.listen(PORT, () => {
        console.log(`工作进程 ${process.pid} 已启动，监听 ${PORT} 端口`);
    });
}