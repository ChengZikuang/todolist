# 使用官方 Node.js 镜像作为基础镜像
FROM node

# 创建并设置工作目录
WORKDIR /backend

# 拷贝 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝项目源码
COPY . .

# 容器对外暴露的端口（与你 app.listen 的端口一致）
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
