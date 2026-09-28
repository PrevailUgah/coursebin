import BrowseSplitPane from "@/components/BrowseSplitPane";
import { getAcademicTree } from "@/lib/tree";

export const dynamic = "force-dynamic";

export default async function BrowseLayout({ children }: { children: React.ReactNode }) {
    const tree = await getAcademicTree();
    return <BrowseSplitPane tree={tree}>{children}</BrowseSplitPane>;
}