<template>
  <div class="home">
    <el-container>
      <el-header class="no-height-limit">
        <h1>Todo List</h1>
        <el-input
          v-model="newTask"
          placeholder="添加新任务"
          @keyup.enter="addTask"
          class="input-new-task"
        >
          <template #append>
            <el-button @click="addTask">添加</el-button>
          </template>
        </el-input>
        <el-checkbox 
          :checked="showCompleted" 
          @change="toggleShowCompleted"
          label="显示已完成任务" 
          border 
          class="show-completed-checkbox"
        />
      </el-header>
      <el-main>
        <ul class="task-list">
          <li v-for="task in filteredTasks" :key="task.id">
            <el-checkbox 
              :checked="task.completed" 
              @change="toggleTaskStatus(task.id)"/>
            <span :class="{ completed: task.completed }" class="task-content">{{ task.content }}</span>
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteTask(task.id)"
              class="delete-btn"
            >删除</el-button>
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '@/store'

export default {
  setup() {
    const taskStore = useTaskStore()
    const newTask = ref('')
    const API_BASE_URL = 'http://localhost:3000/api';

    // 获取任务
    const fetchTasks = () => {
      fetch(`${API_BASE_URL}/tasks?showCompleted=${taskStore.showCompleted}`)
        .then(response => response.json())
        .then(data => {
          taskStore.tasks = data;
        });
    };

    // 添加任务
    const addTask = () => {
      if (newTask.value.trim() !== '') {
        fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newTask.value })
        })
          .then(response => response.json())
          .then(data => {
            taskStore.addTask(data.content);
          });
        newTask.value = '';
      }
    };

    // 删除任务
    const deleteTask = (id) => {
      fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          taskStore.deleteTask(id);
        });
    };

    // 更新任务状态
    const toggleTaskStatus = (id) => {
      const task = taskStore.tasks.find(task => task.id === id);
      if (task) {
        fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ completed: !task.completed })
        })
          .then(() => {
            taskStore.toggleTaskStatus(id);
          });
      }
    };

    // 切换显示已完成任务的状态
    const toggleShowCompleted = (value) => {
      taskStore.setShowCompleted(value);
      fetchTasks(); // 切换状态后重新获取任务
    };

    // 初始化获取任务
    fetchTasks();

    return {
      newTask,
      addTask,
      deleteTask,
      toggleTaskStatus,
      toggleShowCompleted, // 添加此行
      showCompleted: taskStore.showCompleted,
      filteredTasks: computed(() => {
        return taskStore.showCompleted 
          ? taskStore.tasks 
          : taskStore.tasks.filter(task => !task.completed)
      })
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.no-height-limit {
  --el-header-height: auto;
}

.input-new-task {
  width: 100%;
}

.show-completed-checkbox {
  margin-top: 10px;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.task-content {
  margin-left: 10px; /* 增加左边距 */
}

.completed {
  text-decoration: line-through;
  color: #c0c4cc;
}

.delete-btn {
  margin-left: auto;
}
</style>