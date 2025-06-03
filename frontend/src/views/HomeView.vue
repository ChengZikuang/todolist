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
            <el-input
              v-if="task.isEditing"
              v-model="task.editingContent"
              @blur="saveTaskEdit(task)"
              @keyup.enter="saveTaskEdit(task)"
              @keyup.esc="cancelTaskEdit(task)"
              size="small"
              class="task-edit-input"
            />
            <span
              v-else
              :class="{ completed: task.completed }"
              class="task-content"
              @dblclick="startTaskEdit(task)"
            >{{ task.content }}</span>
            <el-button
              type="primary"
              size="small"
              @click="startTaskEdit(task)"
              class="edit-btn"
              >编辑</el-button
            >
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
import { ref, computed } from "vue";
import { useTaskStore } from "@/store";
import axios from "axios";

const taskStore = useTaskStore();
const newTask = ref("");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// 开始编辑任务
const startTaskEdit = (task) => {
  task.isEditing = true;
  task.editingContent = task.content;
};

// 保存任务编辑
const saveTaskEdit = (task) => {
  if (task.editingContent.trim() !== "") {
    
    axios.put(`${API_BASE_URL}/tasks/${task.id}`, {
      content: task.editingContent
    })
      .then(response => {
        console.log('Edit response:', response.data);
        task.content = task.editingContent;
        task.isEditing = false;
        fetchTasks();
      })
      .catch(error => {
        console.error('Failed to update task:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          request: error.request
        });
      });
  }
};

// 取消任务编辑
const cancelTaskEdit = (task) => {
  task.isEditing = false;
  task.editingContent = task.content;
};
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
  margin-left: 10px;
}

.completed {
  text-decoration: line-through;
  color: #c0c4cc;
}

.task-edit-input {
  margin-left: 10px;
  width: 300px;
}

.edit-btn {
  margin-left: auto;
  margin-right: 10px;
}

.delete-btn {
  margin-left: 0;
}
</style>
