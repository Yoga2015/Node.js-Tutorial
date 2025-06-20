const express = require('express');
const app = express();
const PORT = 3000;
const bcrypt = require('bcryptjs'); // 用于密码加密
const saltRounds = 10; // 加密强度

// 内存数据库 - 存储用户数据
let usersDB = [];

// 中间件
app.use(express.json()); // 解析JSON请求体

// 用户注册API - POST /register
app.post('/register', async (req, res) => {

    const { username, password } = req.body;
    
    // 1. 验证输入
    if (!username || !password) {
        return res.status(400).json({ 
            error: '用户名和密码不能为空' 
        });
    }
    
    // 2. 检查用户是否已存在
    const userExists = usersDB.some(u => u.username === username);

    if (userExists) {
        return res.status(400).json({ 
            error: '用户名已存在' 
        });
    }
    
    try {
        // 3. 密码加密 (挑战任务)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 4. 创建用户对象
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword, // 存储加密后的密码
            createdAt: new Date().toISOString()
        };
        
        // 5. 保存到内存数据库
        usersDB.push(newUser);
        
        // 6. 返回成功响应 (不返回密码)
        res.status(201).json({
            message: '注册成功',
            user: {
                id: newUser.id,
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: '服务器错误' 
        });
    }
    
});

// 获取所有用户 (仅用于测试)
app.get('/users', (req, res) => {
    // 不返回密码字段
    const users = usersDB.map(u => ({
        id: u.id,
        username: u.username,
        createdAt: u.createdAt
    }));
    res.json(users);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`用户服务运行在 http://localhost:${PORT}`);
    console.log('可用端点:');
    console.log(`POST http://localhost:${PORT}/register`);
    console.log(`GET  http://localhost:${PORT}/users (测试用)`);
});