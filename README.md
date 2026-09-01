# CourseBin

A resource-sharing platform for Bayero University students — upload and browse past exam questions, lecture notes, and study guides, organized and searchable by course code.

Live app: [coursebin.vercel.app](https://coursebin.vercel.app)

---

## What it does

- Browse courses and their shared resources without needing an account
- Sign in with GitHub to upload a resource (PDF, Word, PowerPoint, Excel, TXT, JPG, or PNG)
- Filter a course's resources by type: past questions, notes, or study guides
- Delete your own uploads
- Every download link is a short-lived signed URL — files are never publicly exposed

<!-- ## Why it exists

Past questions and notes usually get passed around in WhatsApp groups and end up lost. CourseBin gives each course one place to find them.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS v3 |
| Database | Supabase Postgres |
| File storage | Supabase Storage (private bucket, signed URLs) |
| Auth | Supabase Auth (GitHub OAuth) |
| Validation | Zod |
| Testing | Vitest |
| Hosting | Vercel |

## Architecture notes

- Server components read data directly from lib/documents.ts, not via internal fetch() calls — this avoids a known Next.js quirk where relative-URL fetches from server components are unreliable.
- Row Level Security (RLS) is enabled on every table from the first migration, not added later. The database itself refuses an insert or delete that doesn't belong to the requesting user — this holds even if a bug in the application code forgot to check.
- Uploads go directly from the browser to Supabase Storage, not through a Next.js API route. This avoids Vercel's request body size limit on serverless functions.
- File uploads are validated on both the client and at the storage-bucket level (MIME type allowlist, size cap) — client-side validation is for a fast, friendly error message; the bucket-level restriction is what actually can't be bypassed.
- Download links are short-lived signed URLs (60 seconds), not permanent public links, since the storage bucket is private. This means a document can be taken down instantly if needed, without ever having exposed a permanent public link.

## Running locally

Requirements: Node.js 18+, a free [Supabase](https://supabase.com) project, a [GitHub OAuth App](https://github.com/settings/developers). -->

`bash
git clone https://github.com/PrevailUgah/coursebin.git
cd coursebin
npm install