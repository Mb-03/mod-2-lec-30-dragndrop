"use client";
import { createTask, fetchTasks, updateTasks } from "../api/api";
import { COLUMNS } from "../data/data";
import { Task } from "../types";
import Coloumn from "./Coloumn";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DndPage = () => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: (updatedTask: Task) => updateTasks(updatedTask.id, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];

    const task = tasks.find((element) => element.id === taskId);
    if (!task || task.status === newStatus) return;
    const updatedTask = { ...task, status: newStatus };
    mutation.mutate(updatedTask);

    // setTasks(() =>
    //   tasks.map((task) =>
    //     task.id === taskId ? { ...task, status: newStatus } : task
    //   )
    // );
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    createTaskMutation.mutate(newTask);
  };

  if (isLoading) return <p>Loading ...</p>;

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Coloumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onCreateTask={handleCreateTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default DndPage;
