import axios from "./axios";
import {
  useQuery as useReactQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useQuery = ({ key, url, ...rest }) => {
  return useReactQuery({
    queryKey: key,
    queryFn: () => axios.get(`${url}`).then((res) => res.data),
    ...rest,
  });
};

export const usePostMutation = ({ url, updateQueryKey, removeQueryKeys }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.post(`${url}`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      if (removeQueryKeys)
        removeQueryKeys.forEach((element) =>
          queryClient.removeQueries({
            queryKey: element,
          })
        );
      // Optimistically add the new value
      queryClient.setQueryData(updateQueryKey, (old) => [...old, data]);
    },
  });
};

export const usePutMutation = ({
  url,
  updateQueryKey,
  keyField,
  removeQueryKeys,
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) =>
      axios.put(`${url}`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      if (removeQueryKeys)
        removeQueryKeys.forEach((element) =>
          queryClient.removeQueries({
            queryKey: element,
          })
        );
      // Optimistically update to the new value
      queryClient.setQueryData(updateQueryKey, (old) => {
        // Filter out the outdated term and replace with the updated term
        return old.map((item) => {
          if (item[keyField] == data[keyField]) {
            return data;
          } else {
            return item;
          }
        });
      });
    },
  });
};

export const useDeleteMutation = ({
  url,
  updateQueryKey,
  keyField,
  removeQueryKeys,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axios.delete(`${url}`).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      if (removeQueryKeys)
        removeQueryKeys.forEach((element) =>
          queryClient.removeQueries({
            queryKey: element,
          })
        );
      // Optimistically delete the value
      queryClient.setQueryData(updateQueryKey, (old) => {
        return old.filter((item) => item[keyField] != data[keyField]);
      });
    },
  });
};
