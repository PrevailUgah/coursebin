import { z } from "zod";

export const CourseSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    department: z.string(),
});

export const DocumentSchema = z.object({
    id: z.string().uuid(),
    courseId: z.string().uuid(),
    title: z.string().min(1).max(200),
    type: z.enum(["past-question", "notes", "study-guide"]),
    year: z.number().int().optional(),
    semester: z.string().optional(),
    filePath: z.string(),
    fileSize: z.number().int().positive(),
    mimeType: z.string(),
    uploadedBy: z.string().uuid(),
    createdAt: z.string(), // ISO string at the API boundary — avoids the Date-vsstring bug
});

export type Course = z.infer<typeof CourseSchema>;
export type Document = z.infer<typeof DocumentSchema>;