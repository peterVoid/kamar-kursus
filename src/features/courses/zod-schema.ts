import z from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  fileKey: z.string().optional(),
  price: z.number().min(1, "Required"),
  duration: z.number().min(1, "Required"),
  level: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  shortDescription: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
});

export type courseInferSchema = z.infer<typeof courseSchema>;
