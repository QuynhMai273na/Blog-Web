// import Link from "next/link";
// import CustomSelect from "@/components/ui/CustomSelect";
// import { getCategoryOptions, getPublishedPosts } from "@/services/post.service";

// type PostsPageProps = {
//   searchParams?: Promise<{ cat?: string }>;
// };

// export const dynamic = "force-dynamic";

// export default async function PostsPage({ searchParams }: PostsPageProps) {
//   const params = await searchParams;
//   const categorySlug = params?.cat && params.cat !== "all" ? params.cat : undefined;
//   const [posts, categories] = await Promise.all([
//     getPublishedPosts({ categorySlug }),
//     getCategoryOptions(),
//   ]);

//   const topicOptions = [
//     { label: "Tất cả chủ đề", value: "all" },
//     ...categories,
//   ];

//   return (
//     <div className="flex min-h-full w-full flex-col bg-white pb-4">
//       <section className="w-full border-b border-[#f1ddd8] bg-[#fff5f6] px-6 py-10">
//         <div className="mx-auto max-w-5xl text-center">
//           <h1 className="mb-3 font-serif text-2xl italic tracking-[0.02rem] text-sage-800 md:text-3xl">
//             Tất cả bài viết
//           </h1>
//           <p className="font-serif text-base font-light italic text-sage-800/85">
//             những câu chuyện từ hành trình phát triển bản thân của mình
//           </p>
//         </div>
//       </section>

//       <section className="w-full border-b border-[#f1ddd8] px-6 py-4">
//         <form action="/posts" className="mx-auto flex max-w-5xl items-center gap-4">
//           <CustomSelect
//             name="cat"
//             options={topicOptions}
//             defaultValue={categorySlug ?? "all"}
//             className="max-w-full flex-1"
//             buttonClassName="rounded-full border-[#f1ddd8] py-3 pl-6 pr-5 text-sm font-normal text-sage-800 shadow-none hover:border-[#d96e83] focus:border-[#d96e83] focus:ring-[#f1ddd8]"
//             panelClassName="rounded-2xl border-[#f1ddd8]"
//           />
//           <button
//             type="submit"
//             className="rounded-full bg-[#d96e83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c85f70]"
//           >
//             Lọc
//           </button>
//         </form>
//       </section>

//       <section className="flex w-full flex-1 flex-col">
//         {posts.map((post) => (
//           <Link
//             key={post.id}
//             href={`/posts/${post.slug}`}
//             className="w-full border-b border-[#f1ddd8] bg-white transition-colors hover:bg-rose-50"
//           >
//             <article className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-8 md:flex-row md:items-center">
//               <div className="flex h-[110px] w-full flex-shrink-0 items-center justify-center rounded-[14px] border border-rose-200/65 bg-[#fce8eb] text-[40px] shadow-sm transition-transform hover:scale-105 md:w-[160px]">
//                 <span>{getCategoryIcon(post.categorySlug)}</span>
//               </div>

//               <div className="flex flex-1 flex-col justify-center">
//                 <div className="mb-2">
//                   <span className="rounded-full border border-sage-300 bg-sage-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sage-500">
//                     {post.categoryLabel}
//                   </span>
//                 </div>
//                 <h3 className="mb-2 line-clamp-2 font-serif text-xl font-bold tracking-[0.02rem] text-sage-800 transition-colors hover:text-[#d96e83]">
//                   {post.title}
//                 </h3>
//                 <p className="mb-3 line-clamp-2 text-base font-light text-sage-800/85">
//                   {post.excerpt}
//                 </p>
//                 <div className="text-xs font-light uppercase tracking-[0.02rem] text-sage-800/85">
//                   {post.date} <span className="mx-2">•</span> {post.readTime}
//                   <span className="mx-2">•</span> {post.commentCount} bình luận
//                 </div>
//               </div>
//             </article>
//           </Link>
//         ))}
//       </section>

//       {posts.length === 0 && (
//         <section className="flex w-full flex-1 items-center justify-center px-6 py-10">
//           <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm">
//             <div className="mb-4 text-4xl opacity-50">🍃</div>
//             <h3 className="mb-2 font-serif text-xl text-sage-800">
//               Chưa có bài viết nào
//             </h3>
//             <p className="text-sm text-sage-800/60">
//               Nội dung trong chủ đề này sẽ được cập nhật sau.
//             </p>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

// function getCategoryIcon(slug: string) {
//   if (slug === "yoga") return "🧘";
//   if (slug === "finance") return "💰";
//   if (slug === "parenting") return "👶";
//   return "🌻";
// }
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";
import { getCategoryOptions, getPublishedPosts } from "@/services/post.service";

type PostsPageProps = {
  searchParams?: Promise<{ cat?: string }>;
};

export const dynamic = "force-dynamic";

const CATEGORY_STYLES: Record<string, { tagStyle: string; imgBg: string }> = {
  yoga: {
    tagStyle: "bg-sage-100 text-sage-500 border border-sage-300",
    imgBg: "bg-[#e6f7f2]",
  },
  finance: {
    tagStyle: "bg-sand-100 text-sand-500 border border-sand-300",
    imgBg: "bg-[#dcefd8]",
  },
  parenting: {
    tagStyle: "bg-rose-100 text-rose-500 border border-rose-400",
    imgBg: "bg-[#fce8eb]",
  },
  health: {
    tagStyle: "bg-sage-100 text-sage-500 border border-sage-300",
    imgBg: "bg-[#e5f0f5]",
  },
};

const DEFAULT_STYLE = {
  tagStyle: "bg-sand-100 text-sand-500 border border-sand-300",
  imgBg: "bg-[#f9f2ee]",
};

function getCategoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] ?? DEFAULT_STYLE;
}

function getCategoryIcon(slug: string) {
  if (slug === "yoga") return "🧘";
  if (slug === "finance") return "💰";
  if (slug === "parenting") return "👶";
  return "🌻";
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const categorySlug =
    params?.cat && params.cat !== "all" ? params.cat : undefined;
  const [posts, categories] = await Promise.all([
    getPublishedPosts({ categorySlug }),
    getCategoryOptions(),
  ]);

  const topicOptions = [
    { label: "Tất cả chủ đề", value: "all" },
    ...categories,
  ];

  return (
    <div className="flex min-h-full w-full flex-col bg-white pb-4">
      <section className="w-full border-b border-[#f1ddd8] bg-[#fff5f6] px-6 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-3 font-serif text-2xl italic tracking-[0.02rem] text-sage-800 md:text-3xl">
            Tất cả bài viết
          </h1>
          <p className="font-serif text-base font-light italic text-sage-800/85">
            những câu chuyện từ hành trình phát triển bản thân của mình
          </p>
        </div>
      </section>

      <section className="w-full border-b border-[#f1ddd8] px-6 py-4">
        <form
          action="/posts"
          className="mx-auto flex max-w-5xl items-center gap-4"
        >
          <CustomSelect
            name="cat"
            options={topicOptions}
            defaultValue={categorySlug ?? "all"}
            className="max-w-full flex-1"
            buttonClassName="rounded-full border-[#f1ddd8] py-3 pl-6 pr-5 text-sm font-normal text-sage-800 shadow-none hover:border-[#d96e83] focus:border-[#d96e83] focus:ring-[#f1ddd8]"
            panelClassName="rounded-2xl border-[#f1ddd8]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#d96e83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c85f70]"
          >
            Lọc
          </button>
        </form>
      </section>

      <section className="flex w-full flex-1 flex-col">
        {posts.map((post) => {
          const { tagStyle, imgBg } = getCategoryStyle(post.categorySlug);
          return (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="w-full border-b border-[#f1ddd8] bg-white transition-colors hover:bg-rose-50"
            >
              <article className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-8 md:flex-row md:items-center">
                <div
                  className={`flex h-[110px] w-full flex-shrink-0 items-center justify-center rounded-[14px] border border-rose-200/65 text-[40px] shadow-sm transition-transform hover:scale-105 md:w-[160px] ${imgBg}`}
                >
                  <span>{getCategoryIcon(post.categorySlug)}</span>
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <div className="mb-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagStyle}`}
                    >
                      {post.categoryLabel}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 font-serif text-xl font-bold tracking-[0.02rem] text-sage-800 transition-colors hover:text-[#d96e83]">
                    {post.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-base font-light text-sage-800/85">
                    {post.excerpt}
                  </p>
                  <div className="text-xs font-light uppercase tracking-[0.02rem] text-sage-800/85">
                    {post.date} <span className="mx-2">•</span> {post.readTime}
                    <span className="mx-2">•</span> {post.commentCount} bình
                    luận
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {posts.length === 0 && (
        <section className="flex w-full flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm">
            <div className="mb-4 text-4xl opacity-50">🍃</div>
            <h3 className="mb-2 font-serif text-xl text-sage-800">
              Chưa có bài viết nào
            </h3>
            <p className="text-sm text-sage-800/60">
              Nội dung trong chủ đề này sẽ được cập nhật sau.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
