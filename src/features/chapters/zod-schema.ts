import z from "zod";

export const newChapterSchema = z.object({
  title: z.string().min(1, "Required"),
});

export type newChapterInferSchema = z.infer<typeof newChapterSchema>;
