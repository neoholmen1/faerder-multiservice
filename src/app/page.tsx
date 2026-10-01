import { getPageContent } from "@/lib/page-cms";
import HomeClient from "./HomeClient";

export const revalidate = 0;

export default async function HomePage() {
  const content = await getPageContent("home");
  return <HomeClient initialContent={content} />;
}
