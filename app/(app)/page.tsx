import CategoryBar from "@components/CategoriesBar";
import Feed from "@components/Feed";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <CategoryBar/>
      <Feed/>
    </main>
  );
}
