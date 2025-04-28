import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    showCompleted: false // 默认值为 false
  }),
  actions: {
    addTask(content) {
      const newTask = {
        id: Date.now(),
        content: content,
        completed: false,
        created_at: new Date()
      }
      this.tasks.push(newTask)
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id)
    },
    toggleTaskStatus(id) {
      this.tasks = this.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    },
    setShowCompleted(value) {
      this.showCompleted = value
    }
  }
})