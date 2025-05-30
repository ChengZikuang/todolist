# 2025年5月5日

## 一、手动部署

1. mysql

   ```bash
   docker pull mysql:8.0
   
   docker run -d \
   >  --name mysql \
   >  -e MYSQL_ROOT_PASSWORD=admin123 \
   >  -p 3306:3306
   
   #加入网络映射
   docker network connect <network_name> <mysql_container_name_or_id>
   #持久化未作
   ```

2. backend

   ```bash
   #修改连接，对应容器名和数据库账户和密码
   docker build -t my-node-app .
   docker run -d -p 3000:3000 --network mynetwork  my-node-app
   ```

   

3. frontend/dist+nginx

   ```bash
   #前端需修改api路径为生成环境
   docker pull nginx:latest
   #写好default.conf
   docker run -d -p 80:80 
   > -v $(pwd)/nginx/default.conf:/etc/nginx/conf.d/default.conf \
   > -v $(pwd)/frontend/dist:/usr/share/nginx/html \
   > --network mynetwork --name my-nginx nginx
   
   ```

   

## 二、compose一键部署

1. 数据库部署持久化（迁移问题）
2. 前端打包，利用env区分生产环境和开发环境
3. 后端如何区分环境
4. 编写compose.yaml脚本（此时后端是否还需要写Dockerfile）
5. 动态部署版本更新

