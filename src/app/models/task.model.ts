export interface ITask {
  id: number;
  username: string;
  email: string;
  text: string;
  status: 0 | 1 | 10 | 11;
}

export interface ITaskData {
  tasks: ITask[];
  total_task_count: number;
}

export interface ITaskFilter {
  page: number;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

export const STATUS_NAME: { [key: number]: string } = {
  0: 'задача не выполнена',
  1: 'задача не выполнена, отредактирована админом',
  10: 'задача выполнена',
  11: 'задача отредактирована админом и выполнена',
};
