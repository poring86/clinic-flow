"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const VISIBLE_PAGE_COUNT = 5;

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
  onPageSizeChange: (_pageSize: number) => void;
}

export const Pagination = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const pageItems = (() => {
    if (totalPages <= VISIBLE_PAGE_COUNT) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfWindow = Math.floor(VISIBLE_PAGE_COUNT / 2);
    let start = page - halfWindow;
    let end = page + halfWindow;

    if (VISIBLE_PAGE_COUNT % 2 === 0) {
      end -= 1;
    }

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }

    if (end > totalPages) {
      start -= end - totalPages;
      end = totalPages;
    }

    start = Math.max(1, start);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  })();

  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-background/35 px-4 py-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[1.2fr_1fr_1.2fr] xl:items-center">
        <div className="flex flex-wrap items-center gap-3 justify-between xl:justify-start">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total)}–
              {Math.min(page * pageSize, total)}
            </strong>{" "}
            of <strong>{total}</strong>
          </p>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Rows per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-[76px] bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {pageItems.map((item) => {
            return (
              <Button
                key={item}
                variant={item === page ? "secondary" : "outline"}
                size="sm"
                className="min-w-9 px-3"
                onClick={() => onPageChange(item)}
                disabled={totalPages === 0}
              >
                {item}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 xl:justify-end">
          <p className="text-sm text-muted-foreground">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={page === 1 || totalPages === 0}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || totalPages === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages || totalPages === 0}
            >
              »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
