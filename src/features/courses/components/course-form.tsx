"use client";

import { useForm } from "react-hook-form";
import { courseInferSchema, courseSchema } from "../zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateSlug } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEdtitor } from "@/components/richtext";
import { MediaUploader } from "@/components/media-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseCategories, CourseLevel, CourseStatus } from "@/constans";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CourseGetOneAdminOutput } from "../types";

interface Props {
  id?: string;
  data?: CourseGetOneAdminOutput;
}

export function CourseForm({ data, id }: Props) {
  const router = useRouter();

  const form = useForm<courseInferSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      shortDescription: data?.shortDescription ?? "",
      category: data?.category ?? "",
      duration: data?.duration ?? 0,
      fileKey: data?.fileKey ?? "",
      level: data?.level ?? "",
      price: data?.price ?? 0,
      slug: data?.slug ?? "",
      status: data?.status ?? "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createCourse, isPending: createCoursePending } = useMutation(
    trpc.courses.create.mutationOptions({
      onSuccess: () => {
        toast.success("Successfully created course");
        queryClient.invalidateQueries(trpc.courses.getMany.queryFilter());
        queryClient.invalidateQueries(
          trpc.courses.getOneAdmin.queryFilter({ id })
        );
        router.push("/admin/courses");
      },
      onError: (error) => {
        toast.error(error.message ?? "Something went wrong");
      },
    })
  );

  const { mutate: updateCourse, isPending: updateCoursePending } = useMutation(
    trpc.courses.update.mutationOptions({
      onSuccess: () => {
        toast.success("Successfully updated course");
        queryClient.invalidateQueries(trpc.courses.getMany.queryFilter());
        queryClient.invalidateQueries(
          trpc.courses.getOneAdmin.queryFilter({ id })
        );
        router.push("/admin/courses");
      },
      onError: () => {
        toast.error("Failed to updated course");
      },
    })
  );

  const onSubmit = (values: courseInferSchema) => {
    const response =
      data && id
        ? updateCourse({
            id,
            ...values,
          })
        : createCourse(values);
  };

  return (
    <Card className="mt-1">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide basic information about this course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        const generatedSlug = generateSlug(value);
                        form.setValue("slug", generatedSlug);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" />
                  </FormControl>
                  <FormDescription>
                    This short description will be displayed on the Course card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEdtitor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <MediaUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-x-2 w-full">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CourseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CourseLevel.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-2 w-full">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          isNaN(e.target.valueAsNumber)
                            ? 0
                            : form.setValue("duration", e.target.valueAsNumber)
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          isNaN(e.target.valueAsNumber)
                            ? 0
                            : form.setValue("price", e.target.valueAsNumber)
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CourseStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={createCoursePending || updateCoursePending}
            >
              <PlusIcon />
              {data ? "Update" : "Save"} Course
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
