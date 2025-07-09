const express = require('express');
// 导入multer模块用于处理文件上传
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 创建express应用实例
const app = express();
// 设置服务器端口号
const PORT = 3000;

// 配置multer的存储引擎
const storage = multer.diskStorage({
    // 设置文件存储路径
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/'; // 上传目录
        // 如果目录不存在则创建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        // 回调函数，指定文件存储路径
        cb(null, uploadDir);
    },
    // 设置文件名
    filename: (req, file, cb) => {
        // 使用时间戳+原始扩展名作为文件名
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// 创建multer实例，配置存储引擎
const upload = multer({ storage: storage });

// 内存数据库 - 用数组存储表情包数据
let memesDB = [];

// 注册中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.static('public')); // 提供静态文件服务

// 上传表情包路由 - POST /upload
/**
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
app.post('/upload', upload.single('meme'), (req, res) => {
    // 检查是否有文件上传
    if (!req.file) {
        return res.status(400).json({ error: '请选择要上传的文件' });
    }

    // 创建表情包对象
    const newMeme = {
        id: Date.now().toString(), // 唯一ID
        title: req.body.title || '未命名表情', // 标题或默认值
        filename: req.file.filename, // 文件名
        path: '/uploads/' + req.file.filename, // 访问路径
        likes: 0, // 点赞数初始化为0
        createdAt: new Date().toISOString() // 创建时间
    };

    // 保存到内存数据库
    memesDB.push(newMeme);

    // 返回201创建成功响应
    res.status(201).json({
        message: '上传成功',
        meme: newMeme
    });
});

// 获取所有表情包路由 - GET /memes
app.get('/memes', (req, res) => {
    // 按创建时间降序排序
    const sortedMemes = [...memesDB].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    // 返回排序后的表情包列表
    res.json(sortedMemes);
});

// 点赞功能路由 - POST /memes/:id/like
app.post('/memes/:id/like', (req, res) => {
    // 从URL参数获取表情包ID
    const memeId = req.params.id;
    // 查找对应的表情包
    const meme = memesDB.find(m => m.id === memeId);
    
    // 如果找不到返回404错误
    if (!meme) {
        return res.status(404).json({ error: '表情包不存在' });
    }

    // 点赞数加1
    meme.likes += 1;
    // 返回成功响应
    res.json({
        message: '点赞成功',
        likes: meme.likes
    });
});

app.listen(PORT, () => {
    // 服务器启动后打印日志
    console.log(`表情包档案馆运行在 http://localhost:${PORT}`);
    console.log('可用端点:');
    console.log(`POST http://localhost:${PORT}/upload (上传表情)`);
    console.log(`GET  http://localhost:${PORT}/memes (获取表情列表)`);
    console.log(`POST http://localhost:${PORT}/memes/:id/like (点赞)`);
});