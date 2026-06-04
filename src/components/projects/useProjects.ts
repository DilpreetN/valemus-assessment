import { fetchAsync } from "@/utils/fetchJson";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "./project";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { projectActions } from "@/store/projectSlice";
import { useCallback, useEffect } from "react";

const fetchProjects = async () => {
  const data = await fetchAsync<Project[]>("projects");

  return data.sort((a, b) => (a.name > b.name ? 1 : -1));
};

const useProjects = () => {
  const { data, error, status } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const dispatch = useAppDispatch();

  const selectedProject = useAppSelector(
    (state) => state.projects.selectedProject,
  );

  useEffect(() => {
    if (selectedProject == null && status == "success" && error == null) {
      dispatch(projectActions.setProject(data![0]));
    }
  }, [selectedProject, status, error, dispatch, data]);

  const handleSelect = useCallback(
    (id: string) => {
      console.assert(data != null, "Data should not be null on selected");
      const target = data!.find((x) => x.id == id);
      console.assert(target != null, "Select project should not be null");

      dispatch(projectActions.setProject(target!));
    },
    [data, dispatch],
  );

  return {
    selectedProject,
    data,
    error,
    isLoading: status == "pending" && selectedProject == null,
    handleSelect,
  };
};

export default useProjects;
