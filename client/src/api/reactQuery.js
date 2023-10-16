import axios from "./axios";
import {
  useQuery as useReactQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useQuery = ({ key, url, params, ...rest }) => {
  return useReactQuery({
    queryKey: key,
    queryFn: () => {
      // console.log({ params });
      return axios.get(`${url}`, { params }).then((res) => res.data);
    },
    ...rest,
  });
};

export const useGetMutation = ({
  url,
  params,
  updateQueryKey,
  removeQueryKeys,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.get(`${url}`, formData, { params }).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      if (removeQueryKeys)
        removeQueryKeys.forEach((element) =>
          queryClient.removeQueries({
            queryKey: element,
          })
        );
      try {
        // Optimistically add the new value
        if (updateQueryKey) {
          queryClient.setQueryData(updateQueryKey, (old) => [...old, data]);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
};

export const usePostMutation = ({
  url,
  params,
  headers,
  updateQueryKey,
  removeQueryKeys,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios
        .post(`${url}`, formData, { headers, params })
        .then((res) => res.data),
    onSuccess: (data, variables, context) => {
      if (removeQueryKeys)
        removeQueryKeys.forEach((element) =>
          queryClient.removeQueries({
            queryKey: element,
          })
        );
      try {
        // Optimistically add the new value
        if (updateQueryKey)
          queryClient.setQueryData(updateQueryKey, (old) => [...old, data]);
      } catch (e) {
        console.log(e);
      }
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
      try {
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
      } catch (e) {
        console.log(e);
      }
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
      try {
        // Optimistically delete the value
        queryClient.setQueryData(updateQueryKey, (old) => {
          return old.filter((item) => item[keyField] != data[keyField]);
        });
      } catch (e) {
        console.log(e);
      }
    },
  });
};
