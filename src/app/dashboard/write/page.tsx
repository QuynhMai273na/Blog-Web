export default function WritePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 animate-bloom">
      <header className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-300">
          Dashboard
        </p>
        <h1 className="font-serif text-5xl text-sage-800">Viết bài mới</h1>
      </header>

      <form className="space-y-6 rounded-3xl border border-rose-100 bg-white p-8 shadow-sm">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-sage-800/50"
          >
            Tiêu đề
          </label>
          <input
            id="title"
            className="input-field border-rose-100 bg-cream"
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-sage-800/50"
          >
            Nội dung
          </label>
          <textarea
            id="content"
            className="input-field min-h-64 resize-y border-rose-100 bg-cream"
            placeholder="Bắt đầu viết..."
          />
        </div>

        <button type="button" className="btn-primary">
          Lưu bản nháp
        </button>
      </form>
    </div>
  );
}
