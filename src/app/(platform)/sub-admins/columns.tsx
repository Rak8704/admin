"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "@/type/payment";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubAdminForm } from "./sub-admin-form";
import { toast } from "sonner";

// Create a separate component for the actions cell to fix the React Hooks rule violation
const ActionsCell = ({ admin }: { admin: any }) => {
  // Move useState hook inside a proper component
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this sub-admin?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sub-admins/${admin.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete sub-admin");
      }

      toast.success("Sub-admin deleted successfully");
      // In a real application, you would refetch the data here
      // For now, we'll just reload the page
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete sub-admin";
      toast.error(errorMessage);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    // In a real application, you would refetch the data here
    // For now, we'll just reload the page
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sub-Admin</DialogTitle>
          </DialogHeader>
          <SubAdminForm
            initialData={{
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
            }}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export const getColumns = (userRole?: string): ColumnDef<Admin>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      return <Badge>{role as string}</Badge>;
    },
  },
  ...(userRole !== "SUBADMIN" ? [{
    id: "actions",
    cell: ({ row }: { row: any }) => {
      const admin = row.original;
      return <ActionsCell admin={admin} />;
    },
  }] : []),
];