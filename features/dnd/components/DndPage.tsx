"use client";
import { groupBy } from "lodash";
import { createTask, fetchTasks, updateTasks } from "../api/api";
import { COLUMNS } from "../data/data";
import { Task, TaskStatus } from "../types";
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

  const groupedTasks = groupBy(tasks, "status") as Record<TaskStatus, Task[]>;

  const mutation = useMutation({
    mutationFn: (updatedTask: Task) => updateTasks(updatedTask.id, updatedTask),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldData = []) =>
        oldData.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );
      return { previousTasks };
    },
    onError: (err, _varriable, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
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
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      const optimisticTask = {
        ...newTask,
        id: Math.random().toString(), // temporary ID
      };

      queryClient.setQueryData<Task[]>(["tasks"], (oldData = []) => [
        ...oldData,
        optimisticTask,
      ]);
      return { previousTasks };
    },
    onError: (err, _varriable, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
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
              tasks={groupedTasks[column.id] || []}
              onCreateTask={handleCreateTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default DndPage;
