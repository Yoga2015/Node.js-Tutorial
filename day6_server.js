// 导入express框架
const express = require('express');
// 创建express应用实例
const app = express();
// 定义服务器端口号
const PORT = 3000;
// 导入bcryptjs模块用于密码加密
const bcrypt = require('bcryptjs');
// 定义加密强度(盐的轮数)
const saltRounds = 10;

// 内存数据库 - 用数组临时存储用户数据
let usersDB = [];

// 注册中间件 - 解析JSON格式的请求体
app.use(express.json());

// 定义用户注册路由 - POST /register
app.post('/register', async (req, res) => {
    // 从请求体中解构出用户名和密码
    const { username, password } = req.body;
    
    // 1. 验证输入 - 检查用户名和密码是否为空
    if (!username || !password) {
        // 返回400状态码和错误信息
        return res.status(400).json({ 
            error: '用户名和密码不能为空' 
        });
    }
    
    // 2. 检查用户是否已存在 - 使用some方法遍历数组
    const userExists = usersDB.some(u => u.username === username);

    // 如果用户已存在，返回400错误
    if (userExists) {
        return res.status(400).json({ 
            error: '用户名已存在' 
        });
    }
    
    try {
        // 3. 密码加密 - 使用bcrypt的hash方法异步加密
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 4. 创建用户对象
        const newUser = {
            id: Date.now().toString(), // 使用时间戳作为ID
            username, // 用户名
            password: hashedPassword, // 存储加密后的密码
            createdAt: new Date().toISOString() // 创建时间
        };
        
        // 5. 保存用户到内存数据库
        usersDB.push(newUser);
        
        // 6. 返回201创建成功的响应(不包含密码)
        res.status(201).json({
            message: '注册成功',
            user: {
                id: newUser.id,
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });
        
    } catch (error) {
        // 捕获异常，返回500服务器错误
        res.status(500).json({ 
            error: '服务器错误' 
        });
    }
});

// 定义获取用户列表路由 - GET /users (仅用于测试)
app.get('/users', (req, res) => {
    // 使用map方法返回不包含密码的用户列表
    const users = usersDB.map(u => ({
        id: u.id,
        username: u.username,
        createdAt: u.createdAt
    }));
    // 返回JSON格式的用户列表
    res.json(users);
});


app.listen(PORT, () => {
    console.log(`用户服务运行在 http://localhost:${PORT}`);
    console.log('可用端点:');
    console.log(`POST http://localhost:${PORT}/register`);
    console.log(`GET  http://localhost:${PORT}/users (测试用)`);
});