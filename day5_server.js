// 导入express框架
const express = require('express');
// 创建express应用实例
const app = express();
// 定义服务器端口号
const PORT = 3000;

// 模拟天气数据，包含三个城市的天气信息
const weatherData = {
    '北京': { temp: '22°C', condition: '晴 ☀️', wind: '东南风 3级' },
    '上海': { temp: '25°C', condition: '多云 ⛅', wind: '东风 2级' },
    '广州': { temp: '28°C', condition: '阵雨 🌦️', wind: '南风 4级' }
};

// 使用express.json()中间件解析JSON请求体
app.use(express.json());

// 定义GET /weather路由 - 天气查询API
app.get('/weather', (req, res) => {
    
    const city = req.query.city;   // 从查询参数中获取城市名称
    
    // 检查是否提供了城市参数
    if (!city) {
        // 返回400错误，表示客户端请求错误
        return res.status(400).json({ error: '请提供城市参数' });
    }
    
    const data = weatherData[city];   // 从模拟数据中获取该城市的天气信息

    // 检查城市是否存在
    if (!data) {
        // 返回404错误，表示资源未找到
        return res.status(404).json({ error: '未找到该城市天气数据' });
    }
    
    // 返回JSON格式的天气数据，包含时间戳
    res.json({
        city: city,  // 城市名称
        ...data,     // 展开天气数据
        timestamp: new Date().toISOString()  // 添加时间戳
    });
});

// 定义POST /secret路由 - 彩蛋路由
app.post('/secret', (req, res) => {
    
    const magicWord = req.body.magicWord;    // 从请求体中获取magicWord参数
    
    // 检查魔咒是否正确
    if (magicWord === '芝麻开门') {

        // 返回成功的JSON响应
        res.json({
            message: '恭喜发现宝藏 💎',
            reward: '无限量奶茶券 🧋',
            hint: '明天的密码是"菠萝披萨"'
        });

    } else {

        // 返回403错误，表示禁止访问
        res.status(403).json({
            error: '魔咒不对哦~再想想吧 🧙‍♂️',
            hint: '试试《阿里巴巴与四十大盗》里的咒语'
        });
    }
});

// 启动服务器监听指定端口
app.listen(PORT, () => {
    
    console.log(`天气API服务运行在 http://localhost:${PORT}`);
    console.log('可用端点:');
    console.log(`GET  http://localhost:${PORT}/weather?city=北京`);
    console.log(`POST http://localhost:${PORT}/secret`);
    console.log('挑战任务: 使用Thunder Client测试这些API');
});



// 总结：

// 1. 使用Express框架搭建RESTful API
// 2. 实现两个核心功能端点：
//    - 天气查询（GET请求，查询参数）
//    - 彩蛋路由（POST请求，JSON请求体）
// 3. 完善的错误处理机制
// 4. 模拟数据存储
// 5. 详细的控制台启动日志
// 6. 符合RESTful设计规范
// 7. 准备Thunder Client测试的提示信息