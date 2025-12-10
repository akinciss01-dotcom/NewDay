"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Morning meditation", completed: false },
    { id: 2, text: "Review daily goals", completed: false },
  ])
  const [inputValue, setInputValue] = useState("")

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }])
      setInputValue("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 via-card to-primary/5 border-2 border-border/50 shadow-lg">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-1">Today's Tasks</h2>
          <p className="text-sm text-muted-foreground">Stay organized and productive</p>
        </div>

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

        <div className="space-y-2">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 animate-in slide-in-from-left",
                todo.completed
                  ? "bg-muted/30 border-muted"
                  : "bg-background/50 border-border/50 hover:border-primary/30",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="rounded-md" />
              <span
                className={cn(
                  "flex-1 text-sm transition-all duration-300",
                  todo.completed && "line-through text-muted-foreground",
                )}
              >
                {todo.text}
              </span>
              <Button
                onClick={() => deleteTodo(todo.id)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm animate-in fade-in duration-500">
            No tasks yet. Add one to get started!
          </div>
        )}
      </div>
    </Card>
  )
}