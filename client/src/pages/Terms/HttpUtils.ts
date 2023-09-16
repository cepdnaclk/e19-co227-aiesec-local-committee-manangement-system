import axios from "../../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TermType } from "./Types";
const url = "terms";

export const TermList = () => {
  return useQuery({
    queryKey: ["term-list"],
    queryFn: () =>
      axios.get<{ data: TermType[] }>(`${url}`).then((res) => res.data),
    // since only one user can mutate the terms (LCP),
    // any automatic refetching will be redundant hence disabled
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const TermSelected = (id: String, editMode) => {
  return useQuery({
    queryKey: ["term-selected"],
    queryFn: () =>
      axios.get<{ data: TermType }>(`${url}/${id}`).then((res) => res.data),
    enabled: editMode !== "add" ? true : false,
    refetchOnMount: true,
  });
};

export const CreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.post(`${url}`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      // Optimistically add the new value
      queryClient.setQueryData(["term-list"], (old: TermType[]) => [
        ...old,
        data,
      ]);
    },
  });
};

export const UpdateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: TermType) =>
      axios.put(`${url}/${formData.id}`, formData).then((res) => res.data),
    onSuccess: (data: TermType, variables, context) => {
      // Optimistically update to the new value
      queryClient.setQueryData(["term-list"], (old: TermType[]) => {
        // Filter out the outdated term and replace with the updated term
        return old.map((item) => {
          if (item.id === data.id) {
            return data;
          } else {
            return item;
          }
        });
      });
    },
  });
};

export const DeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: TermType) =>
      axios.delete(`${url}/${formData.id}`).then((res) => res.data),
    onSuccess: (data: TermType, variables, context) => {
      // Optimistically delete the value
      queryClient.setQueryData(["term-list"], (old: TermType[]) => {
        return old.filter((item) => item.id !== data.id);
      });
    },
  });
};
