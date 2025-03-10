import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

export default function Pagination({
  page,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4 max-w-6xl mx-auto">
      <div className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          onClick={onFirstPage}
          disabled={page === 1}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          <ChevronsLeftIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          onClick={onPrevPage}
          disabled={page === 1}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          onClick={onNextPage}
          disabled={page === totalPages}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          <ChevronRightIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          onClick={onLastPage}
          disabled={page === totalPages}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          <ChevronsRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
