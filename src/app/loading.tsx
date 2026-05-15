export default function Loading() {
  return (
    <div className="min-h-full bg-cream px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="skeleton h-10 w-2/3 rounded-xl sm:w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-rose-100 bg-white p-5 shadow-sm"
            >
              <div className="skeleton mb-4 aspect-video rounded-[16px]" />
              <div className="skeleton mb-3 h-5 rounded-lg" />
              <div className="skeleton h-4 w-3/4 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
