import z from "zod";

export const newLessonSchema = z.object({
  title: z.string().min(1, "Required"),
});

export type newLessonInferSchema = z.infer<typeof newLessonSchema>;

export const lessonDetailsSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type lessonDetailsInferSchema = z.infer<typeof lessonDetailsSchema>;
