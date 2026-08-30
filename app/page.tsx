import DocumentCard from "@/components/DocumentCard";

const testDoc = {
  id: "1",
  title: "2023 Past Questions",
  type: "past-question",
  courses: { code: "CSC203" },
};

export default function Home() {
  return <div className="p-8 max-w-sm">
    <DocumentCard doc={testDoc} />
  </div>
}

