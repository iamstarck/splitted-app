import { useMemo, useState } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;

    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  return { page, setPage, totalPages, paginatedData };
};
