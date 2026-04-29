export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryName = decodeURIComponent(id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 animate-bloom">
      <header className="mb-12 border-b border-rose-100 pb-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-300">
          Chủ đề
        </p>
        <h1 className="mb-3 font-serif text-5xl text-sage-800">
          {categoryName}
        </h1>
        <p className="text-sm text-sage-800/60">
          Các bài viết thuộc chủ đề này sẽ được hiển thị tại đây.
        </p>
      </header>

      <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center text-sm text-sage-800/60 shadow-sm">
        Chưa có bài viết trong chủ đề này.
      </div>
    </div>
  );
}
