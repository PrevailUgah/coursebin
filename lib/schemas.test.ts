import { describe, it, expect } from "vitest";
import { DocumentSchema } from "./schemas";

const validDoc = {
    id: crypto.randomUUID(),
    courseId: crypto.randomUUID(),
    title: "2023 Past Questions",
    type: "notes",
    filePath: "user-id/CSC203/file.pdf",
    fileSize: 102400,
    mimeType: "application/pdf",
    uploadedBy: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
};

describe("DocumentSchema", () => {
    it("accepts a valid document", () => {
        expect(DocumentSchema.safeParse(validDoc).success).toBe(true);
    });

    it("rejects an invalid document type", () => {
        const result = DocumentSchema.safeParse({ ...validDoc, type: "not-a-real-type" });
        expect(result.success).toBe(false);
    });

    it("rejects an empty title", () => {
        const result = DocumentSchema.safeParse({ ...validDoc, title: "" });
        expect(result.success).toBe(false);
    });

    it("rejects a negative file size", () => {
        const result = DocumentSchema.safeParse({ ...validDoc, fileSize: -5 });
        expect(result.success).toBe(false);
    });
});