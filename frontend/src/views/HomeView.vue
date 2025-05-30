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
          v-model="showCompleted"
          label="显示已完成任务"
          border
          class="show-completed-checkbox"
        />
      </el-header>
      <el-main>
        <ul class="task-list">
          <li v-for="task in filteredTasks" :key="task.id">
            <el-checkbox
              :model-value="task.completed"
              @update:model-value="() => toggleTaskStatus(task.id)"
            />
            <span :class="{ completed: task.completed }" class="task-content">{{
              task.content
            }}</span>
            <el-button
              type="danger"
              size="small"
              @click="deleteTask(task.id)"
              class="delete-btn"
              >删除</el-button
            >
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useTaskStore } from "@/store";
import axios from "axios";

const taskStore = useTaskStore();
const newTask = ref("");
const API_BASE_URL = "http://47.122.77.131:3000/api";

// 获取任务
const fetchTasks = () => {
  axios.get(`${API_BASE_URL}/tasks`, {
    params: {
      showCompleted: taskStore.showCompleted
    }
  })
    .then(response => {
      taskStore.tasks = response.data;
    });
};

// 添加任务
const addTask = () => {
  if (newTask.value.trim() !== "") {
    axios.post(`${API_BASE_URL}/tasks`, {
      content: newTask.value
    })
      .then(response => {
        taskStore.addTask(response.data.content);
        newTask.value = "";
      });
  }
};

// 删除任务
const deleteTask = (id) => {
  axios.delete(`${API_BASE_URL}/tasks/${id}`)
    .then(() => {
      taskStore.deleteTask(id);
    });
};

// 更新任务状态
const toggleTaskStatus = (id) => {
  const task = taskStore.tasks.find((task) => task.id === id);
  
  if (task) {
    // 先更新前端状态
    taskStore.toggleTaskStatus(id);
    const newCompletedStatus = !task.completed;
    
    // 然后发送请求到后端
    axios.put(`${API_BASE_URL}/tasks/${id}`, {
      completed: newCompletedStatus
    })
      .then(response => {
        console.log('Backend response:', response);
      })
      .catch(error => {
        console.error('Failed to update task status:', error);
        // 如果请求失败，回滚前端状态
        taskStore.toggleTaskStatus(id);
      });
  } else {
    console.error('Task not found with id:', id);
  }
};

// 监听 showCompleted 的变化
const showCompleted = computed({
  get: () => taskStore.showCompleted,
  set: (value) => {
    taskStore.setShowCompleted(value);
    fetchTasks();
  }
});

// 初始化获取任务
fetchTasks();

// 计算属性
const filteredTasks = computed(() => {
  return taskStore.showCompleted
    ? taskStore.tasks
    : taskStore.tasks.filter((task) => !task.completed);
});
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
