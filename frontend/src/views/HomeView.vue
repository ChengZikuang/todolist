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

    const addTask = () => {
      if (newTask.value.trim() !== '') {
        taskStore.addTask(newTask.value)
        newTask.value = ''
      }
    }

    const deleteTask = (id) => {
      taskStore.deleteTask(id)
    }

    const toggleTaskStatus = (id) => {
      taskStore.toggleTaskStatus(id)
    }

    const toggleShowCompleted = (value) => {
      taskStore.setShowCompleted(value)
    }

    return {
      newTask,
      addTask,
      deleteTask,
      toggleTaskStatus,
      toggleShowCompleted,
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