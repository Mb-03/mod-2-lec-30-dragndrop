"use client";

import { useDroppable } from "@dnd-kit/core";
import { ColumnProps } from "../types";
import TaskCard from "./TaskCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskForm, taskSchema } from "../schemta";
import { useState } from "react";

const Column = ({ column, tasks, onCreateTask }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [showForm, setShowForm] = useState(false);

  console.log(showForm, column.id);

  const style = {
    opacity: isOver ? 1 : 0.5,
    backgroundColor: isOver ? "#FF0000" : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskForm) => {
    onCreateTask({ ...data, status: column.id });
    reset();
    setShowForm(false);
  };

  return (
    <div className="flex w-80 flex-col rounded-xl bg-neutral-800 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-white">{column.title}</h2>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {showForm ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 rounded-lg bg-neutral-700 p-4"
          >
            <input
              {...register("title")}
              placeholder="Task title"
              className="w-full rounded-md bg-neutral-600 p-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}

            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full rounded-md bg-neutral-600 p-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded border border-neutral-500 px-4 py-2 text-neutral-300 hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 rounded bg-neutral-700 px-4 py-2 text-sm text-blue-400 hover:bg-neutral-600 hover:text-blue-300 transition"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
