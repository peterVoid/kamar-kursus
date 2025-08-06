import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newChapterInferSchema, newChapterSchema } from "../zod-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface Props {
  courseId: string;
}

export function NewChapterForm({ courseId }: Props) {
  const form = useForm<newChapterInferSchema>({
    resolver: zodResolver(newChapterSchema),
    defaultValues: {
      title: "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createChapter, isPending: createChapterPending } =
    useMutation(
      trpc.chapters.create.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
          form.reset();
          toast.success("Successfully created new Chapter");
        },
        onError: () => {
          toast.error("Failed to create new Chapter");
        },
      })
    );

  const onSubmit = (values: newChapterInferSchema) => {
    createChapter({
      ...values,
      courseId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={createChapterPending}>
            Save Change
          </Button>
        </div>
      </form>
    </Form>
  );
}
