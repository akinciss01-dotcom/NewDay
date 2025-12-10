"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ArrowLeft, Calendar, Clock, Bell, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  text: string
  completed: boolean
  category: string
  dueDate?: string
  dueTime?: string
  reminder?: string
  priority: "low" | "medium" | "high"
}

interface TasksPageProps {
  onBack: () => void
}

export function TasksPage({ onBack }: TasksPageProps) {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Morning meditation",
      completed: false,
      category: "wellness",
      dueDate: "2024-01-15",
      dueTime: "08:00",
      reminder: "30min",
      priority: "high",
    },
    {
      id: 2,
      text: "Review daily goals",
      completed: false,
      category: "productivity",
      priority: "medium",
    },
    {
      id: 3,
      text: "Grocery shopping",
      completed: true,
      category: "personal",
      priority: "low",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<number | null>(null)
  const [reminderForm, setReminderForm] = useState({
    dueDate: "",
    dueTime: "",
    reminder: "none",
  })

  const categories = ["wellness", "productivity", "personal", "fitness", "learning"]

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [todos])

  const checkReminders = () => {
    const now = new Date()

    todos.forEach((todo) => {
      if (todo.completed || !todo.dueDate || !todo.dueTime || !todo.reminder || todo.reminder === "none") {
        return
      }

      const [year, month, day] = todo.dueDate.split("-").map(Number)
      const [hours, minutes] = todo.dueTime.split(":").map(Number)
      const dueDateTime = new Date(year, month - 1, day, hours, minutes)

      let reminderMinutes = 0
      switch (todo.reminder) {
        case "5min":
          reminderMinutes = 5
          break
        case "15min":
          reminderMinutes = 15
          break
        case "30min":
          reminderMinutes = 30
          break
        case "1hour":
          reminderMinutes = 60
          break
        case "1day":
          reminderMinutes = 1440
          break
      }

      const reminderTime = new Date(dueDateTime.getTime() - reminderMinutes * 60000)

      if (now >= reminderTime && now < new Date(reminderTime.getTime() + 60000)) {
        showNotification(todo)
      }
    })
  }

  const showNotification = (todo: Todo) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("NewDay Reminder", {
        body: `${todo.text} is due soon!`,
        icon: "/notification-icon.png",
        badge: "/notification-icon.png",
      })
    }
  }

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          category: "personal",
          priority: "medium",
        },
      ])
      setInputValue("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const openReminderModal = (todoId: number) => {
    const todo = todos.find((t) => t.id === todoId)
    if (todo) {
      setEditingTodo(todoId)
      setReminderForm({
        dueDate: todo.dueDate || "",
        dueTime: todo.dueTime || "",
        reminder: todo.reminder || "none",
      })
      setShowReminderModal(true)
    }
  }

  const saveReminder = () => {
    if (editingTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo
            ? {
                ...todo,
                dueDate: reminderForm.dueDate || undefined,
                dueTime: reminderForm.dueTime || undefined,
                reminder: reminderForm.reminder !== "none" ? reminderForm.reminder : undefined,
              }
            : todo,
        ),
      )
      setShowReminderModal(false)
      setEditingTodo(null)
      setReminderForm({ dueDate: "", dueTime: "", reminder: "none" })
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false
    if (filter === "completed" && !todo.completed) return false
    if (categoryFilter !== "all" && todo.category !== categoryFilter) return false
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 border-red-500/50 text-red-600"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-600"
      case "low":
        return "bg-green-500/10 border-green-500/50 text-green-600"
      default:
        return ""
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      wellness: "bg-primary/10 text-primary",
      productivity: "bg-secondary/10 text-secondary",
      personal: "bg-accent/10 text-accent",
      fitness: "bg-purple-500/10 text-purple-600",
      learning: "bg-blue-500/10 text-blue-600",
    }
    return colors[category] || "bg-muted/10 text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-6">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-lg border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Today's Tasks</h1>
              <p className="text-xs text-muted-foreground">
                {filteredTodos.filter((t) => !t.completed).length} tasks remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
        {/* Add Task Input */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-border/50 shadow-lg">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="rounded-xl border-2 bg-background/50 backdrop-blur-sm"
            />
            <Button
              onClick={addTodo}
              size="icon"
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("active")}
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              Active
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              Completed
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setCategoryFilter("all")}
              variant={categoryFilter === "all" ? "secondary" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              <Tag className="w-3 h-3 mr-1" />
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setCategoryFilter(category)}
                variant={categoryFilter === category ? "secondary" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTodos.map((todo, index) => (
            <Card
              key={todo.id}
              className={cn(
                "p-4 transition-all duration-300 animate-in slide-in-from-left border-2",
                todo.completed ? "bg-muted/20 border-muted" : "bg-card border-border/50 hover:border-primary/30",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="rounded-md mt-1"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300",
                        todo.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        onClick={() => openReminderModal(todo.id)}
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getCategoryColor(todo.category))}>
                      {todo.category}
                    </span>
                    <span className={cn("text-xs px-2 py-1 rounded-full border", getPriorityColor(todo.priority))}>
                      {todo.priority}
                    </span>
                  </div>

                  {(todo.dueDate || todo.dueTime || todo.reminder) && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {todo.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{todo.dueDate}</span>
                        </div>
                      )}
                      {todo.dueTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{todo.dueTime}</span>
                        </div>
                      )}
                      {todo.reminder && (
                        <div className="flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          <span>{todo.reminder} before</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-muted-foreground text-sm">No tasks found</p>
            <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters or add a new task</p>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-border/50">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Today's Progress</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{todos.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{todos.filter((t) => t.completed).length}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{todos.filter((t) => !t.completed).length}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Set Reminder</h2>
              <Button onClick={() => setShowReminderModal(false)} variant="ghost" size="icon" className="rounded-full">
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Due Date</label>
                <Input
                  type="date"
                  value={reminderForm.dueDate}
                  onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Due Time</label>
                <Input
                  type="time"
                  value={reminderForm.dueTime}
                  onChange={(e) => setReminderForm({ ...reminderForm, dueTime: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Remind Me</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "none", label: "No Reminder" },
                    { value: "5min", label: "5 minutes before" },
                    { value: "15min", label: "15 minutes before" },
                    { value: "30min", label: "30 minutes before" },
                    { value: "1hour", label: "1 hour before" },
                    { value: "1day", label: "1 day before" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => setReminderForm({ ...reminderForm, reminder: option.value })}
                      variant={reminderForm.reminder === option.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowReminderModal(false)} variant="outline" className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button onClick={saveReminder} className="flex-1 rounded-xl">
                Save Reminder
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}