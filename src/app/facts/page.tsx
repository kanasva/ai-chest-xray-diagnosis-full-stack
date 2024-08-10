export const dynamic = "force-dynamic";

import Content from "@/app/facts/content.mdx";

export default function page() {
  return (
    <div className="flex w-full flex-1 items-start justify-center bg-surface">
      {/* content area max-w-1280 */}
      <main className="flex max-w-[1280px] flex-1 flex-col items-center p-4 sm:p-6">
        <div className="mdx max-w-[800px]">
          <Content />
        </div>
      </main>
    </div>
  );
}
