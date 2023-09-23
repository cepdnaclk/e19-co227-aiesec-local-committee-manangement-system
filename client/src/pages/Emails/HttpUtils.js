import axios from "../../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const url = "email/templates";

export const TemplateList = () => {
  return useQuery({
    queryKey: ["email-template-list"],
    queryFn: () => axios.get(`${url}`).then((res) => res.data),
  });
};

export const TemplateSelected = (id, editMode) => {
  return useQuery({
    queryKey: ["email-templated-selected"],
    queryFn: () => axios.get(`${url}/${id}`).then((res) => res.data),
    enabled: editMode !== "add" ? true : false,
    refetchOnMount: true,
  });
};

export const CreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.post(`${url}`, formData).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      // Optimistically add the new value
      queryClient.setQueryData(["email-template-list"], (old) => [
        ...old,
        data,
      ]);
    },
  });
};

// export const UpdateApplicant = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, formData }) =>
//       axios.put(`${url}/applicants/${id}`, formData).then((res) => res.data),
//     onSuccess: (data, variables, context) => {
//       // Optimistically update to the new value
//       queryClient.setQueryData(["ogv-applicant-list"], (old) => {
//         // Filter out the outdated term and replace with the updated term
//         return old.map((item) => {
//           if (item.id === data.id) {
//             return data;
//           } else {
//             return item;
//           }
//         });
//       });
//     },
//   });
// };

// export const DeleteApplicant = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id) =>
//       axios.delete(`${url}/applicants/${id}`).then((res) => res.data),
//     onSuccess: (data, variables, context) => {
//       console.log("Heeee", data);
//       // Optimistically delete the value
//       queryClient.setQueryData(["ogv-applicant-list"], (old) => {
//         return old.filter((item) => item.id.toString() !== data.id);
//       });
//     },
//   });
// };
