import axios from "../../../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const url = "ogv";

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

export const ApplicantList = () => {
  return useQuery({
    queryKey: ["ogv-applicant-list"],
    queryFn: () => axios.get(`${url}/applicants`).then((res) => res.data),
  });
};

export const InChargeMemberList = () => {
  return useQuery({
    queryKey: ["ogv-cxp-member-list"],
    queryFn: () => axios.get(`${url}/members`).then((res) => res.data),
    // refetch only on page refresh
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    staleTime: twentyFourHoursInMs,
  });
};

export const ApplicantSelected = (id, editMode) => {
  return useQuery({
    queryKey: ["ogv-applicant-selected"],
    queryFn: () => axios.get(`${url}/applicants/${id}`).then((res) => res.data),
    enabled: editMode !== "add" ? true : false,
    refetchOnMount: true,
  });
};

export const CreateApplicant = (
  setEditMode,
  setSelectedItemKey,
  notifySuccess,
  notifyError
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.post(`${url}/applicants`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      // Optimistically add the new value
      queryClient.setQueryData(["ogv-applicant-list"], (old) => [...old, data]);
    },
  });
};

export const UpdateApplicant = (setEditMode, notifySuccess, notifyError) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) =>
      axios.put(`${url}/applicants/${id}`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      // Optimistically update to the new value
      queryClient.setQueryData(["ogv-applicant-list"], (old) => {
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

export const DeleteApplicant = (setEditMode, notifySuccess, notifyError) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      axios.delete(`${url}/applicants/${id}`).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      console.log("Heeee", data);
      // Optimistically delete the value
      queryClient.setQueryData(["ogv-applicant-list"], (old) => {
        return old.filter((item) => item.id.toString() !== data.id);
      });
    },
  });
};
