### 1.前后端更新

前端新增.env.production文件，打包dist

后端修改app.js，database修改为容器名

## 2.备份数据库（若存在）

导出 SQL 文件（使用 MySQL 容器）

```bash
docker exec mysql bash -c "mysqldump -u root -padmin123 todolist" > backup.sql
```

## 3.一键部署compose.yaml

:white_check_mark:确保存在backend\frontend\nginx\backup.sql\docker-compose.yml\env

```bash
//1.compose下线（若存在容器）
docker compose down
//2.compose上线
docker compose up -d
//3.删除全部容器
docker rm -f $(docker ps -aq)
//4.更新代码后重新构建
docker compose up -d --build
//5.追踪nodelog
docker logs -f node-backend


```
