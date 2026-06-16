import { useQuery } from "@tanstack/react-query";
import { patronsApi } from "./api";

export function usePatrons() {
  return useQuery({
    queryKey: ["patrons"],
    queryFn: patronsApi.getPatrons,
  });
}
