import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is Required"),
  description: z.string().min(1, "Description is Required"),
});

export type TaskForm = z.infer<typeof taskSchema>;
