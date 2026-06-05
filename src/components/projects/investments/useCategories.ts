import { useQuery } from "@tanstack/react-query";
import type { Category } from "./category";
import { fetchAsync } from "@/utils/fetchJson";

const fetchCategories = async () => {
  const data = await fetchAsync<Category[]>("categories");

  return data.sort((a, b) => (a.name > b.name ? 1 : -1));
};

const useCategories = () => {
  const { data, error, status } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return {
    data,
    error,
    isLoading: status == "pending",
  };
};

export default useCategories;
