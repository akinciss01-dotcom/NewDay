"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Clock, Calendar, Bell, Flag, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  text: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  dueTime?: string
  reminder?: string
  subtasks: { id: number; text: string; completed: boolean }[]
}

interface TodoDetailPageProps {
  onBack: () => void
}

export function TodoDetailPage({ onBack }: TodoDetailPageProps) {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Morning meditation",
      description: "10 minutes of guided meditation",
      completed: false,
      priority: "high",
      category: "Self Care",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "08:00",
      reminder: "15",
      subtasks: [],
    },
  ])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all")

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      todos.forEach((todo) => {
        if (todo.dueDate && todo.dueTime && todo.reminder && !todo.completed) {
          const dueDateTime = new Date(`${todo.dueDate}T${todo.dueTime}`)
          const reminderTime = new Date(dueDateTime.getTime() - Number.parseInt(todo.reminder) * 60000)

          if (now >= reminderTime && now < dueDateTime) {
            if (Notification.permission === "granted") {
              new Notification("NewDay Reminder", {
                body: `${todo.text} - Due in ${todo.reminder} minutes`,
                icon: "/notification-icon.png",
              })
            }
          }
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        description: "",
        completed: false,
        priority: "medium",
        category: "Personal",
        subtasks: [],
      }
      setTodos([newTodo, ...todos])
      setInputValue("")
      setSelectedTodo(newTodo)
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    if (selectedTodo?.id === id) setSelectedTodo(null)
  }

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
    if (selectedTodo?.id === id) {
      setSelectedTodo({ ...selectedTodo, ...updates })
    }
  }

  const addSubtask = (todoId: number, subtaskText: string) => {
    const todo = todos.find((t) => t.id === todoId)
    if (todo) {
      const newSubtask = { id: Date.now(), text: subtaskText, completed: false }
      updateTodo(todoId, { subtasks: [...todo.subtasks, newSubtask] })
    }
  }

  const toggleSubtask = (todoId: number, subtaskId: number) => {
    const todo = todos.find((t) => t.id === todoId)
    if (todo) {
      const updatedSubtasks = todo.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st,
      )
      updateTodo(todoId, { subtasks: updatedSubtasks })
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0]
      return todo.dueDate === today && !todo.completed
    }
    if (filter === "upcoming") {
      const today = new Date().toISOString().split("T")[0]
      return todo.dueDate && todo.dueDate > today && !todo.completed
    }
    return !todo.completed || filter === "all"
  })

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "text-red-500 border-red-500"
    if (priority === "medium") return "text-yellow-500 border-yellow-500"
    return "text-green-500 border-green-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pb-6">
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tasks & Reminders</h1>
              <p className="text-xs text-muted-foreground">Organize your day efficiently</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-2 mb-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task..."
                className="rounded-xl border-2 bg-background/50"
              />
              <Button onClick={addTodo} size="icon" className="rounded-xl bg-primary hover:bg-primary/90 shadow-md">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["all", "today", "upcoming", "completed"] as const).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs whitespace-nowrap"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredTodos.map((todo, index) => (
            <Card
              key={todo.id}
              className={cn(
                "border-2 transition-all duration-300 cursor-pointer hover:shadow-lg animate-in slide-in-from-bottom",
                todo.completed ? "border-muted bg-muted/20" : "border-border/50 hover:border-primary/30",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedTodo(todo)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          "font-medium text-sm transition-all",
                          todo.completed && "line-through text-muted-foreground",
                        )}
                      >
                        {todo.text}
                      </h3>
                      <Flag className={cn("w-3 h-3", getPriorityColor(todo.priority))} />
                    </div>
                    {todo.description && <p className="text-xs text-muted-foreground mb-2">{todo.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {todo.category}
                      </Badge>
                      {todo.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                      {todo.dueTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {todo.dueTime}
                        </Badge>
                      )}
                      {todo.reminder && (
                        <Badge variant="outline" className="text-xs">
                          <Bell className="w-3 h-3 mr-1" />
                          {todo.reminder}m before
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTodo(todo.id)
                    }}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <Card className="border-2 border-dashed border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-sm">No tasks found in this filter</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedTodo && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
          onClick={() => setSelectedTodo(null)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6 max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Task Details</h2>
                <Button onClick={() => setSelectedTodo(null)} variant="ghost" size="icon" className="rounded-full">
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Task Name</Label>
                  <Input
                    value={selectedTodo.text}
                    onChange={(e) => updateTodo(selectedTodo.id, { text: e.target.value })}
                    className="rounded-xl border-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Description</Label>
                  <Textarea
                    value={selectedTodo.description}
                    onChange={(e) => updateTodo(selectedTodo.id, { description: e.target.value })}
                    placeholder="Add details about this task..."
                    className="rounded-xl border-2 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Priority</Label>
                    <Select
                      value={selectedTodo.priority}
                      onValueChange={(value) => updateTodo(selectedTodo.id, { priority: value as Todo["priority"] })}
                    >
                      <SelectTrigger className="rounded-xl border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Category</Label>
                    <Select
                      value={selectedTodo.category}
                      onValueChange={(value) => updateTodo(selectedTodo.id, { category: value })}
                    >
                      <SelectTrigger className="rounded-xl border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Self Care">Self Care</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Due Date</Label>
                    <Input
                      type="date"
                      value={selectedTodo.dueDate || ""}
                      onChange={(e) => updateTodo(selectedTodo.id, { dueDate: e.target.value })}
                      className="rounded-xl border-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Due Time</Label>
                    <Input
                      type="time"
                      value={selectedTodo.dueTime || ""}
                      onChange={(e) => updateTodo(selectedTodo.id, { dueTime: e.target.value })}
                      className="rounded-xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Reminder (minutes before)</Label>
                  <Select
                    value={selectedTodo.reminder || "none"}
                    onValueChange={(value) =>
                      updateTodo(selectedTodo.id, { reminder: value === "none" ? undefined : value })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No reminder</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Subtasks</Label>
                  <div className="space-y-2">
                    {selectedTodo.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => toggleSubtask(selectedTodo.id, subtask.id)}
                        />
                        <span
                          className={cn("flex-1 text-sm", subtask.completed && "line-through text-muted-foreground")}
                        >
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subtask..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            addSubtask(selectedTodo.id, e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                        className="rounded-lg border-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}