import Content from "@/app/facts/Content.mdx";

export default function page() {
  return (
    <div className="flex w-full flex-1 items-start justify-center bg-surface">
      {/* content area max-w-1280 */}
      <main className="flex max-w-[1280px] flex-1 flex-col items-center px-4 pb-4 sm:px-6 sm:pb-4">
        <div className="mdx max-w-[800px]">
          <Content />
        </div>
      </main>
    </div>
  );
}
