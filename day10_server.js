const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件服务

// 创建uploads目录（如果不存在）
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置API路由
const apiRouter = express.Router();

// 获取所有表情包
apiRouter.get('/memes', (req, res) => {
    try {
        // 读取uploads目录下的文件
        const files = fs.readdirSync(uploadDir);
        const memes = files.map((file, index) => ({
            id: index + 1,
            name: path.parse(file).name,
            url: `/uploads/${file}`,
            likes: 0
        }));
        res.json(memes);     
    } catch (error) {
        res.status(500).json({ error: '获取表情包失败' });
    }
});

// 上传表情包路由 - POST /api/memes
apiRouter.post('/memes', (req, res) => {
    // req.files: 包含上传的文件对象
    // req.files.meme: 前端表单中name="meme"的文件输入
    
    // 1. 检查是否有文件上传
    if (!req.files || !req.files.meme) {
        // 返回400状态码和错误信息
        return res.status(400).json({ 
            error: '请选择要上传的文件',
            hint: '请确保表单enctype="multipart/form-data"且name="meme"'
        });
    }

    // 2. 获取上传的文件对象
    const memeFile = req.files.meme;
    
    // 3. 生成唯一文件名 (时间戳+原始文件名)
    const fileName = `${Date.now()}_${memeFile.name}`;
    
    // 4. 构造文件保存路径
    const filePath = path.join(uploadDir, fileName);

    // 5. 移动文件到目标目录
    memeFile.mv(filePath, (err) => {
        // err: 移动文件时可能发生的错误
        
        if (err) {
            // 返回500状态码和错误信息
            return res.status(500).json({ 
                error: '文件上传失败',
                details: err.message 
            });
        }
        
        // 6. 返回成功响应
        res.json({ 
            message: '上传成功',
            url: `/uploads/${fileName}`,
            filename: fileName,
            size: memeFile.size,
            mimetype: memeFile.mimetype
        });
    });
});

// 点赞功能
apiRouter.post('/memes/:id/like', (req, res) => {
    // 这里可以添加实际的点赞逻辑
    res.json({ message: '点赞成功' });
});

// 将API路由挂载到'/api'路径
app.use('/api', apiRouter);

// 处理所有其他路由，返回前端应用
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器错误');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，访问 http://localhost:${PORT}`);
    console.log('API端点:');
    console.log(`GET  http://localhost:${PORT}/api/memes`);
    console.log(`POST http://localhost:${PORT}/api/memes`);
});