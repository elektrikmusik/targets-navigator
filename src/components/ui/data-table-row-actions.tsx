"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: {
    label: string;
    onClick: (row: Row<TData>) => void;
    icon?: React.ComponentType<{ className?: string }>;
    shortcut?: string;
    variant?: "default" | "destructive";
  }[];
}

export function DataTableRowActions<TData>({ row, actions = [] }: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row)}
            className={action.variant === "destructive" ? "text-destructive" : ""}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
            {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
