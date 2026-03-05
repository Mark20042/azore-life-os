import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { type Task } from "@/types/index";

export const useMyTasks = (filters?: any) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const response = await api.get("/tasks", { params: filters });
      return response.data.tasks as Task[];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTaskData: {
      title: string;
      deadline: string;
      category: string;
      priority?: "low" | "medium" | "high";
    }) => {
      const response = await api.post("/tasks", newTaskData);
      return response.data.task;
    },
    onSuccess: () => {
      // this tells TanStack to instantly refresh the calendar when a new task is added!
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Task> & { id: number }) => {
      const response = await api.patch(`/tasks/${id}`, updateData);
      return response.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
