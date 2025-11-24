import { Task } from "../types";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("https://680ceb032ea307e081d56f4d.mockapi.io/myBlog");

  if (!res.ok) throw new Error("Failed to Fetch");

  return res.json();
}

export async function updateTasks(taskId: string, updates: Partial<Task>) {
  const res = await fetch(
    `https://680ceb032ea307e081d56f4d.mockapi.io/myBlog/${taskId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );

  if (!res.ok) throw new Error("Failed to Update");
  return res.json();
}

export async function createTask(newTask: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(
    "https://680ceb032ea307e081d56f4d.mockapi.io/myBlog",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }
  );
  if (!res.ok) throw new Error("Failed to Update");

  return res.json();
}
