import { useQuery } from "@tanstack/react-query";
import { patronsApi } from "./api";

export function usePatrons() {
  return useQuery({
    queryKey: ["patrons"],
    queryFn: patronsApi.getPatrons,
  });
}

export function usePatronDetail(id: number | null | undefined) {
  return useQuery({
    queryKey: ["patrons", id],
    queryFn: () => (id ? patronsApi.getPatronById(id) : null),
    enabled: !!id,
  });
}
