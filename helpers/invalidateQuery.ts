import { queryClient } from "@/providers/QueryProvider";

export const invalidateQuery = (queryKey: any) => {
  queryClient.invalidateQueries({ queryKey });
};
