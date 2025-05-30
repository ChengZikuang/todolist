## 1.备份数据库

### 导入导出docker

 A. 在云服务器备份数据卷

```bash
# 打包 docker volume 到 tar 文件
docker run --rm \
  -v mysql-data:/volume \
  -v $(pwd):/backup \
  alpine \
  tar czvf /backup/mysql-volume-backup.tar.gz -C /volume ./

```

C. 在备用 PC 还原为 Docker Volume

```bash
# 创建目标 volume（名字应一致）
docker volume create mysql-data

# 还原备份内容到新 volume
docker run --rm \
  -v mysql-data:/volume \
  -v /home/backup:/backup \
  alpine \
  sh -c "cd /volume && tar xzvf /backup/mysql-volume-backup.tar.gz"

```

### docker备份至windows

A. 导出 SQL 文件（使用 MySQL 容器）

```bash
docker exec mysql \
  mysqldump -u root -pyourpassword yourdb > backup.sql

```

B.导入SQL文件

在下载的backup.sql文件打开powershell

```bash
cmd /c "mysql -u root -p todolist < backup.sql"
```

C.docker还原指定SQL(暂未测试)

```bash
docker exec -i mysql mysql -u root -p'yourpassword' newdb < /path/in/container/backup.sql

```

## 2.一键部署compose.yaml

:white_check_mark:成功！！！！

### 3.修改前后端

记得加env
