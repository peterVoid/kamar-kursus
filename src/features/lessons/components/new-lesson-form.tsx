import { useForm } from "react-hook-form";
import { newLessonInferSchema, newLessonSchema } from "../zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";

interface Props {
  chapterId: string;
}

export function NewLessonForm({ chapterId }: Props) {
  const form = useForm<newLessonInferSchema>({
    resolver: zodResolver(newLessonSchema),
    defaultValues: {
      title: "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createLesson, isPending: createLessonPending } = useMutation(
    trpc.lessons.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
        form.reset();
        toast.success("Successfully created new Lesson");
      },
      onError: () => {
        toast.error("Failed to create new Lesson");
      },
    })
  );

  const onSubmit = (values: newLessonInferSchema) => {
    createLesson({
      ...values,
      chapterId,
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
          <Button type="submit" disabled={createLessonPending}>
            Save Change
          </Button>
        </div>
      </form>
    </Form>
  );
}
