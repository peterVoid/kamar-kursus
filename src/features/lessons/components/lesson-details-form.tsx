"use client";

import { useForm } from "react-hook-form";
import { lessonDetailsInferSchema, lessonDetailsSchema } from "../zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEdtitor } from "@/components/richtext";
import { MediaUploader } from "@/components/media-uploader";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface Props {
  id: string;
}

export function LessonDetailsForm({ id }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.lessons.getOne.queryOptions({
      id,
    })
  );

  const form = useForm<lessonDetailsInferSchema>({
    resolver: zodResolver(lessonDetailsSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      thumbnailKey: data?.thumbnailKey ?? "",
      videoKey: data?.videoKey ?? "",
    },
  });

  const { mutate, isPending } = useMutation(
    trpc.lessons.addLessonDetails.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.lessons.getOne.queryFilter());
        toast.success("Successfully updated lesson details");
      },
      onError: () => {
        toast.success("Failed updated lesson details");
      },
    })
  );

  const onSubmit = (values: lessonDetailsInferSchema) => {
    console.log(values);
    mutate({
      ...values,
      id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
          name="thumbnailKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <MediaUploader
                  value={field.value}
                  onChange={field.onChange}
                  type="image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <MediaUploader
                  value={field.value}
                  onChange={field.onChange}
                  type="video"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
}
