const express = require('express');
const cors = require('cors');
const pool = require('./database'); // 导入数据库连接池

const app = express();
app.use(cors());
app.use(express.json());

// 测试数据库连接
pool.query('SELECT 1 + 1 AS solution')
  .then(([rows, fields]) => {
    console.log('数据库连接成功:', rows[0].solution);
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
    process.exit(1); // 退出进程
  });

// 获取所有任务
app.get('/api/tasks', async (req, res) => {
  try {
    const showCompleted = req.query.showCompleted === 'true';
    const sql = showCompleted 
      ? 'SELECT * FROM tasks' 
      : 'SELECT * FROM tasks WHERE completed = 0';

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 添加新任务
app.post('/api/tasks', async (req, res) => {
  try {
    const { content } = req.body;
    const createdAt = new Date();

    const [result] = await pool.query(
      'INSERT INTO tasks (content, completed, created_at) VALUES (?, ?, ?)',
      [content, false, createdAt]
    );

    res.status(201).json({ id: result.insertId, content, completed: false, created_at: createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 更新任务状态
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    await pool.query(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed, id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});