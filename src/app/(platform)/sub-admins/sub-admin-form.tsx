"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ManagementRole } from "@/type/payment";
import { INTERNAL_SERVER_ERROR } from "@/error";

const subAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "SUBADMIN"]),
});

type SubAdminFormValues = z.infer<typeof subAdminSchema>;

export function SubAdminForm({
  initialData,
  onSuccess,
}: {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: ManagementRole;
  };
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "SUBADMIN",
    },
  });

  const onSubmit = (data: SubAdminFormValues) => {
    startTransition(async () => {
      try {
        const url = initialData
          ? `/api/sub-admins/${initialData.id}`
          : "/api/sub-admins";
        
        const method = initialData ? "PUT" : "POST";
        
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || INTERNAL_SERVER_ERROR);
        }

        toast.success(
          initialData 
            ? "Sub-admin updated successfully" 
            : "Sub-admin created successfully"
        );
        
        form.reset();
        onSuccess?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : INTERNAL_SERVER_ERROR;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={isPending}
                    placeholder="Enter name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={isPending}
                    placeholder="Enter email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={isPending}
                    placeholder="Enter password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">
                      Admin
                    </SelectItem>
                    <SelectItem value="SUBADMIN">
                      Sub-Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving..." : initialData ? "Update Sub-Admin" : "Create Sub-Admin"}
          </Button>
        </form>
      </Form>
    </div>
  );
}