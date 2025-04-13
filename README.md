# Node.js 是什么 ?   

Node.js 不是一门新的编程语言，也不是一个 JavaScript 框架，而是 一个 Javascript运行环境 ( runtime environment )  。
Node.js 是一个基于 Chrome V8引擎 的 JavaScript 运行环境，让我们可以 在服务器端 运行 JavaScript 代码。
Node.js 与 浏览器 都是  运行环境，都能够解析 JS 程序。

# 运行环境 是什么？

运行环境，就是 程序 在运行期间 需要依赖的一系列组件 或者 工具；把这些工具和组件 打包在一起提供给程序员，程序员就能运行自己编写的代码了。

**对于 JavaScript 来说，它在运行期间需要依赖以下组件:**

（1）解释器
JavaScript 是一种脚本语言，需要一边解释一边运行，用到 哪些源代码 就编译 哪些源代码，整个过程 由 解释器 完成。
没有解释器的话，JavaScript 只是 一堆纯文本文件，不能被 计算机 识别。

（2） 标准库
我们 在 JavaScript 代码中 会调用 一些内置函数，这些函数 不是我们自己编写的，而是 标准库 自带的。

（3）本地模块
所谓 本地模块，就是 已经被提前编译好 的 模块，它们 是 二进制文件，和 可执行文件 在内部结构上 没有什么区别，只是不能 单独运行 而已。
这些 本地模块 其实就是 动态链接库（在 Windows 下是 .dll 文件），如果你使用过C语言、C++ 等编译型语言，那你应该能够更好地理解它。
