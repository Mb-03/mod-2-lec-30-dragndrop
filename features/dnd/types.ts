export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type ColumnType = {
  id: TaskStatus;
  title: string;
};

export type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
};

export type TaskCardProps = {
  task: Task;
};
