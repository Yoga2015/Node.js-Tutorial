// 导入express框架
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // 使用环境变量中的端口或默认3000

// 配置静态文件服务
// __dirname: 当前文件所在目录
// path.join(): 拼接路径，兼容不同操作系统
app.use(express.static(path.join(__dirname, 'public')));

// 配置API路由
const apiRouter = express.Router();

// 表情包相关路由
apiRouter.get('/memes', (req, res) => {
    // req: 请求对象
    // res: 响应对象
    res.json([
        {id: 1, name: '开心猫', url: '/images/cat.jpg', likes: 42},
        {id: 2, name: '狗头', url: '/images/dog.jpg', likes: 35}
    ]);
});

// 将API路由挂载到'/api'路径
app.use('/api', apiRouter);

// 处理所有其他路由，返回前端应用
app.get('*', (req, res) => {
    // path.resolve(): 解析为绝对路径
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，访问 http://localhost:${PORT}`);
    console.log('准备部署到云服务:');
    console.log('1. 注册Heroku/Vercel账号');
    console.log('2. 安装CLI工具');
    console.log('3. 执行部署命令');
});