// 模块导入 ( require ) ： 导入 Node.js 内置的 http 模块，用于 创建 HTTP 服务器 和 客户端
const http = require('http');

// 服务器创建 ( createServer ) ：使用 http.createServer() 方法 创建一个 HTTP 服务器实例
const server = http.createServer((req, res) => {       // 请求处理 回调函数 ：当客户端发送请求时，服务器会调用这个回调函数，处理请求并返回响应

    // 响应头设置 ( writeHead ) ：使用 res.writeHead() 方法 设置 HTTP 响应头，状态码为 200(成功)，内容类型 为 纯文本
    res.writeHead(200, {'Content-Type': 'text/plain'});   
    
    res.end('Hello, Node.js!');   // 响应结束和发送 ( end ) ：使用 res.end() 方法 结束响应，并向客户端发送 "Hello, Node.js!"
});

// 服务器监听 ( listen ) ：使用 server.listen() 方法 启动服务器，监听 3000 端口，主机名为 localhost （监听 指定的端口 和 主机名）        
server.listen(3000, 'localhost', () => { 

    console.log('服务器运行在 http://localhost:3000/');      // 当服务器启动成功后，在控制台打印这条消息
});


//  想启动 这个简单的服务器 ， 打开终端（控制台） ， 输入 node server.js 回车 就可以了，控制台里会 打印出 这条消息 “服务器运行在 http://localhost:3000/”，说明服务器已经启动了

// 服务器启动后，就可以去访问 http://localhost:3000/  网址了， 显示 "Hello, Node.js!"