### 1.前后端更新

前端新增.env.production文件，打包dist

后端修改app.js，直接替换

## 2.备份数据库（若存在）

导出 SQL 文件（使用 MySQL 容器）

```bash
docker exec mysql \
  mysqldump -u root -pyourpassword yourdb > backup.sql
```

## 3.一键部署compose.yaml

:white_check_mark:确保存在backend\frontend\nginx\backup.sql\docker-compose.yml\env

```bash
//1.compose下线（若存在容器）
docker compose down
//2.compose上线
docker compose up -d


```
