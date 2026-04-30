"use client";

import { Cormorant_Garamond } from "next/font/google";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CalendarDays,
  Check,
  Clock3,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  MessageCircle,
  Pin,
  Quote,
  Search,
  Sparkles,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import { KeyboardEvent, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { X } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const categoryOptions = [
  "Yoga & Sức khỏe",
  "Parenting",
  "Tài chính",
  "Lối sống chậm",
];

const initialTags = ["yoga", "mẹ bầu", "sức khỏe"];

const initialContent = `<p>Mình chưa từng nghĩ hành trình làm mẹ lại dạy mình cách lắng nghe cơ thể sâu đến vậy.</p><p>Đêm xuống, khi em bé chuyển mình, mình bắt đầu tìm đến những động tác yoga rất chậm để thả lỏng lưng và hông.</p><h2>1. Tư thế con mèo - con bò</h2><p>Đây là chuỗi chuyển động nhẹ, giúp cột sống linh hoạt hơn và nhịp thở đều lại sau một ngày dài.</p><blockquote><p>Điều mình nhận ra là: chỉ cần 10 phút đủ dịu dàng, cơ thể đã bớt căng thẳng rất nhiều.</p></blockquote>`;

type PublishMode = "draft" | "scheduled" | "published";
type ToggleKey = "comments" | "featured" | "emailSubscribers" | "showHomepage";

type PublishOption = {
  value: PublishMode;
  label: string;
  helper: string;
  dot: string;
};

const publishOptions: PublishOption[] = [
  {
    value: "draft",
    label: "Bản nháp",
    helper: "Có thể chỉnh sửa",
    dot: "bg-[#a58f8f]",
  },
  {
    value: "scheduled",
    label: "Lên lịch",
    helper: "Đợi giờ đăng",
    dot: "bg-[#d3a566]",
  },
  {
    value: "published",
    label: "Đăng ngay",
    helper: "Công khai",
    dot: "bg-[#7ba88f]",
  },
];

const toggleMeta: Array<{
  key: ToggleKey;
  label: string;
  icon: typeof MessageCircle;
}> = [
  { key: "comments", label: "Cho phép bình luận", icon: MessageCircle },
  { key: "featured", label: "Ghim lên đầu", icon: Pin },
  { key: "emailSubscribers", label: "Gửi email subscribers", icon: Mail },
  { key: "showHomepage", label: "Hiển thị trang chủ", icon: Sparkles },
];

const averageWordsPerMinute = 220;

const activeFormats = useEditorState({
  editor,
  selector: (ctx) => ({
    bold:         ctx.editor?.isActive("bold") ?? false,
    italic:       ctx.editor?.isActive("italic") ?? false,
    underline:    ctx.editor?.isActive("underline") ?? false,
    h2:           ctx.editor?.isActive("heading", { level: 2 }) ?? false,
    h3:           ctx.editor?.isActive("heading", { level: 3 }) ?? false,
    blockquote:   ctx.editor?.isActive("blockquote") ?? false,
    bulletList:   ctx.editor?.isActive("bulletList") ?? false,
    orderedList:  ctx.editor?.isActive("orderedList") ?? false,
    link:         ctx.editor?.isActive("link") ?? false,
    alignLeft:    ctx.editor?.isActive({ textAlign: "left" }) ?? false,
    alignCenter:  ctx.editor?.isActive({ textAlign: "center" }) ?? false,
    alignRight:   ctx.editor?.isActive({ textAlign: "right" }) ?? false,
  }),
});

function ToolbarBtn({
  label,
  icon: Icon,
  onClick,
  active = false,
}: {
  label: string;
  icon: typeof Type;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-[14px] border px-3 text-[13px] font-medium transition-all duration-150 ${
        active
          ? "border-rose-400 bg-rose-100 text-rose-600 shadow-[0_2px_8px_rgba(214,100,100,0.25)] scale-[0.97]"
          : "border-rose-100 bg-white/90 text-[#6f5a5a] hover:border-rose-200 hover:text-rose-400"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? "stroke-[2.5]" : ""}`} />
      <span className={`hidden sm:inline ${active ? "font-semibold" : ""}`}>
        {label}
      </span>
    </button>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-[#8a6b6b] transition-all duration-200 hover:border-rose-300 hover:bg-rose-50"
      >
        Lưu nháp
      </button>
      <button
        type="button"
        className="rounded-full border border-sage-100 bg-sage-50 px-4 py-2 text-sm font-medium text-[#64806f] transition-all duration-200 hover:border-sage-300 hover:bg-white"
      >
        Xem trước
      </button>
      <button
        type="button"
        className="rounded-full bg-sage-300 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(168,198,159,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage-800"
      >
        Đăng bài
      </button>
    </div>
  );
}

export default function WritePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(
    "5 động tác yoga giúp mẹ bầu ngủ ngon mỗi tối",
  );
  const [excerpt, setExcerpt] = useState(
    "Những tư thế nhẹ nhàng phù hợp cho tam cá nguyệt thứ ba, giúp mình và bé yêu cùng nghỉ ngơi sâu hơn mỗi đêm.",
  );
  const [publishMode, setPublishMode] = useState<PublishMode>("scheduled");
  const [scheduledAt, setScheduledAt] = useState("2026-05-02T20:30");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialTags);
  const [seoTitle, setSeoTitle] = useState(
    "5 động tác yoga giúp mẹ bầu ngủ ngon hơn mỗi tối",
  );
  const [seoDescription, setSeoDescription] = useState(
    "Những tư thế yoga nhẹ nhàng giúp mẹ bầu thư giãn, ngủ sâu hơn và giảm đau lưng ở tam cá nguyệt cuối.",
  );
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    comments: true,
    featured: false,
    emailSubscribers: false,
    showHomepage: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({
    publish: true,
    cover: false,
    category: false,
    seo: false,
    options: false,
  });

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      UnderlineExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Bắt đầu câu chuyện của bạn..." }),
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[520px] px-2 py-1 text-[1.08rem] leading-[2.05] text-white font-serif",
      },
    },
  });

  const wordCount = useMemo(
    () => {
      if (!editor) return 0;
      return editor.getText().trim().split(/\s+/).filter(Boolean).length;
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor?.state],
  );

  const readTime = Math.max(1, Math.ceil(wordCount / averageWordsPerMinute));

  function insertImageUrl() {
    const url = window.prompt("Dán URL ảnh để chèn vào bài viết")?.trim();
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  }

  function insertLinkUrl() {
    const url = window.prompt("Dán URL link")?.trim();
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  }

  function handleFile(file: File | null) {
    if (!file) return;
    setCoverFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function handleTagSubmit() {
    const nextTag = tagInput.trim().toLowerCase();
    if (!nextTag || tags.includes(nextTag)) return;
    setTags((current) => [...current, nextTag]);
    setTagInput("");
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleTagSubmit();
  }

  function handleToggle(key: ToggleKey) {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  }

  function toggleSidebar(key: string) {
    setSidebarOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function SidebarSection({
    id,
    icon: Icon,
    title,
    iconColor,
    children,
  }: {
    id: string;
    icon: typeof Type;
    title: string;
    iconColor: string;
    children: React.ReactNode;
  }) {
    const open = sidebarOpen[id];
    return (
      <section className="rounded-[26px] border border-white/90 bg-[#fffdfb]/95 shadow-[0_16px_50px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSidebar(id)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2.5">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            <span className="font-serif text-[1.35rem] font-normal italic text-[#4a3737]">
              {title}
            </span>
          </div>
          <span
            className={`text-[#b09292] transition-transform duration-200 text-sm ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
        {open && (
          <div className="border-t border-rose-100/60 px-5 pb-5 pt-4">
            {children}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className={`${cormorant.variable} relative isolate overflow-hidden`}>
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.78),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(209,231,221,0.56),transparent_32%),linear-gradient(180deg,#fdfbf6_0%,#f8f1e7_50%,#fcfaf6_100%)]"
      />

      {/* ── page header ── */}
      <header className="relative mb-6 flex items-start justify-between rounded-[34px] border border-white/80 bg-white/80 px-6 py-8 shadow-[0_24px_70px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md">
        {/* LEFT TOP */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-sage-300">
            Dashboard / Editor
          </p>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 top-6 w-full max-w-2xl -translate-x-1/2 text-center px-4">
          <h1 className="mt-3 font-serif text-[2.3rem] font-normal text-[#3d2f2f] md:text-[3.2rem]">
            Viết bài mới
          </h1>

          <p className="mt-2 text-sm text-[#7f6d6d]">
            Một trang soạn thảo đầy đủ cho tiêu đề, excerpt, nội dung, lịch
            đăng...
          </p>
        </div>

        {/* RIGHT */}
        <div className="rounded-[24px] border border-sage-100 bg-sage-50/80 px-5 py-4 text-sm text-[#64806f] shadow-sm">
          <p className="font-medium">Chỉnh sửa lần cuối</p>
          <p className="mt-1 text-[13px] text-[#7c9283]">DD/MM/YYYY • Time</p>
        </div>
      </header>

      {/* ── Main scrollable area ── */}
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── Left: writing area ── */}
          {/* <div className="space-y-5"> */}
          <div className="space-y-5 h-[calc(100vh-120px)] overflow-y-auto pr-2">
            {/* Toolbar — sticky header của cột trái */}
            <div className="sticky top-0 z-30 rounded-[26px] border border-white/90 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md">
              <div className="flex flex-wrap gap-2">
                <ToolbarBtn
                  label="H2"
                  icon={Heading2}
                  active={editor?.isActive("heading", { level: 2 }) ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                />
                <ToolbarBtn
                  label="H3"
                  icon={Heading3}
                  active={editor?.isActive("heading", { level: 3 }) ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Đậm"
                  icon={Bold}
                  active={editor?.isActive("bold") ?? false}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolbarBtn
                  label="Nghiêng"
                  icon={Italic}
                  active={editor?.isActive("italic") ?? false}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                />
                <ToolbarBtn
                  label="Gạch"
                  icon={UnderlineIcon}
                  active={editor?.isActive("underline") ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Trái"
                  icon={AlignLeft}
                  active={editor?.isActive({ textAlign: "left" }) ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                />
                <ToolbarBtn
                  label="Giữa"
                  icon={AlignCenter}
                  active={editor?.isActive({ textAlign: "center" }) ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                />
                <ToolbarBtn
                  label="Phải"
                  icon={AlignRight}
                  active={editor?.isActive({ textAlign: "right" }) ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Quote"
                  icon={Quote}
                  active={editor?.isActive("blockquote") ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                />
                <ToolbarBtn
                  label="List"
                  icon={List}
                  active={editor?.isActive("bulletList") ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarBtn
                  label="Số"
                  icon={ListOrdered}
                  active={editor?.isActive("orderedList") ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Ảnh"
                  icon={ImageIcon}
                  onClick={insertImageUrl}
                />
                <ToolbarBtn
                  label="Link"
                  icon={LinkIcon}
                  active={editor?.isActive("link") ?? false}
                  onClick={insertLinkUrl}
                />
              </div>
            </div>
            {/* Card chính — Title + Excerpt + Editor */}
            <div className="overflow-hidden rounded-[34px] border border-white/90 bg-[#fffefd]/95 shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md">
              {/* Title */}
              <div className="px-7 pt-7 md:px-10 md:pt-10">
                <label
                  htmlFor="title"
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b28d8d]"
                >
                  Tiêu đề
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Đặt tiêu đề bài viết"
                  className="mt-3 w-full border-none bg-transparent text-[2.2rem] italic leading-[1.2] text-[#3a312f] outline-none placeholder:text-[#c4b5b1] md:text-[3rem]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                />
              </div>

              {/* Divider */}
              <div className="mx-7 my-6 h-px bg-gradient-to-r from-rose-100 via-rose-200/60 to-transparent md:mx-10" />

              {/* Excerpt */}
              <div className="px-7 md:px-10">
                <label
                  htmlFor="excerpt"
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b28d8d]"
                >
                  Tóm tắt hiển thị ngoài danh sách
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Viết 1-2 câu mô tả ngắn"
                  className="mt-3 min-h-[72px] w-full resize-none bg-transparent font-serif text-[1.05rem] italic leading-[1.8] text-[#6a5555] outline-none placeholder:text-[#c4b5b1]"
                />
              </div>

              {/* Divider */}
              <div className="mx-7 my-6 h-px bg-gradient-to-r from-rose-100 via-rose-200/60 to-transparent md:mx-10" />

              {/* Tiptap editor — dark section bên dưới */}
              {/* <div className="bg-white"> */}
              <div className="bg-[#fdfcfb] border-t border-rose-100/60">
                <div className="flex items-center justify-between px-7 py-4 md:px-10">
                  <div>
                    <p
                      className="font-serif text-[1.2rem] italic text-[#6a5555]"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Nội dung chính
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#b09292]">
                      Viết như Word — chọn text để format
                    </p>
                  </div>
                  <div className="rounded-full border border-rose-100 bg-rose-50/60 px-3 py-1.5 text-[11px] text-[#a07878]">
                    {wordCount} từ · ~{readTime} phút
                  </div>
                </div>
                <div className="px-7 pb-7 md:px-10 md:pb-10">
                  <div
                    className="rounded-[20px] border border-rose-100 bg-white shadow-[inset_0_2px_8px_rgba(180,140,140,0.06),0_2px_12px_rgba(180,140,140,0.08)] px-6 py-5 min-h-[520px] cursor-text"
                    onClick={() => editor?.commands.focus()}
                  >
                    <EditorContent
                      editor={editor}
                      className="
                      [&_.ProseMirror]:outline-none
                      [&_.ProseMirror]:min-h-[520px]
                      [&_.ProseMirror]:text-[#3a312f]
                      [&_.ProseMirror]:leading-[2]
                      [&_.ProseMirror_p]:mb-4
                      [&_.ProseMirror_p]:text-[1.05rem]
                      [&_.ProseMirror_h2]:font-serif
                      [&_.ProseMirror_h2]:text-[1.6rem]
                      [&_.ProseMirror_h2]:font-semibold
                      [&_.ProseMirror_h2]:text-[#3a312f]
                      [&_.ProseMirror_h2]:mt-8
                      [&_.ProseMirror_h2]:mb-3
                      [&_.ProseMirror_blockquote]:border-l-[3px]
                      [&_.ProseMirror_blockquote]:border-rose-300
                      [&_.ProseMirror_blockquote]:pl-5
                      [&_.ProseMirror_blockquote]:italic
                      [&_.ProseMirror_blockquote]:text-[#7a6666]
                      [&_.ProseMirror_blockquote]:my-5
                      [&_.ProseMirror_a]:text-rose-400
                      [&_.ProseMirror_a]:underline
                      [&_.ProseMirror_.is-editor-empty:first-child::before]:text-[#c4b5b1]
                    "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between rounded-[28px] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_12px_36px_rgba(45,62,47,0.06)] backdrop-blur-md">
              <p className="text-[12px] italic text-[#8b7777]">
                Hành trình ngàn dặm bắt đầu từ một trang giấy trắng 🌸
              </p>
              <ActionButtons />
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-3">
            {/* Publish status */}
            <SidebarSection
              id="publish"
              icon={CalendarDays}
              title="Trạng thái đăng"
              iconColor="text-rose-300"
            >
              <div className="space-y-2">
                {publishOptions.map((option) => {
                  const active = publishMode === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPublishMode(option.value)}
                      className={`flex w-full items-center justify-between rounded-[16px] border px-4 py-3 text-left transition-all duration-200 ${
                        active
                          ? "border-rose-300 bg-rose-50 shadow-[0_6px_18px_rgba(214,156,161,0.18)]"
                          : "border-rose-100 bg-white hover:border-rose-200"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${option.dot}`}
                        />
                        <span className="text-[14px] font-semibold text-[#5c4747]">
                          {option.label}
                        </span>
                      </span>
                      <span className="text-[11px] text-[#9b8888]">
                        {active ? option.helper : "Chọn"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {publishMode === "scheduled" && (
                <div className="mt-4 rounded-[18px] border border-sand-200 bg-[#fcf5ea] px-4 py-4">
                  <label
                    htmlFor="scheduled-at"
                    className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a58352]"
                  >
                    Ngày & giờ đăng
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="scheduled-at"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full rounded-[14px] border border-transparent bg-[#2f2d2b] px-4 py-3 text-sm font-medium text-white outline-none"
                    />
                    <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  </div>
                </div>
              )}
            </SidebarSection>

            {/* Cover image */}
            <SidebarSection
              id="cover"
              icon={ImageIcon}
              title="Ảnh bìa"
              iconColor="text-sage-300"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex w-full flex-col items-center justify-center rounded-[20px] border border-dashed px-4 py-6 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-rose-300 bg-rose-50"
                    : "border-rose-200 bg-white hover:border-rose-300 hover:bg-rose-50/40"
                }`}
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="h-36 w-full rounded-[16px] object-cover"
                  />
                ) : (
                  <>
                    <div className="mb-3 rounded-full border border-rose-100 bg-rose-50 p-3 text-xl">
                      🖼️
                    </div>
                    <p className="text-sm font-semibold text-[#8b6666]">
                      Kéo thả hoặc chọn ảnh
                    </p>
                    <p className="mt-1 text-[11px] text-[#b09292]">
                      JPG, PNG, WEBP · 16:9
                    </p>
                  </>
                )}
              </button>
              {coverFileName && (
                <p className="mt-2 text-[11px] text-[#8a7676]">
                  Đã chọn: {coverFileName}
                </p>
              )}
            </SidebarSection>

            {/* Category & Tags */}
            <SidebarSection
              id="category"
              icon={Type}
              title="Phân loại & Tags"
              iconColor="text-[#d5ab72]"
            >
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a58f8f]">
                Danh mục chính
              </label>
              <div className="relative mt-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-[14px] border border-transparent bg-[#2f2d2b] px-4 py-3 text-[14px] font-medium text-white outline-none"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
                  ▾
                </span>
              </div>

              <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a58f8f]">
                Tags
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium ${
                      index % 3 === 0
                        ? "border-rose-100 bg-rose-50 text-[#c27d85]"
                        : index % 3 === 1
                          ? "border-sage-100 bg-sage-50 text-[#6c8f7a]"
                          : "border-sand-200 bg-[#fcf5ea] text-[#b78a54]"
                    }`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((c) => c.filter((t) => t !== tag))}
                      aria-label={`Xóa ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Thêm tag, nhấn Enter..."
                  className="w-full rounded-[14px] border border-transparent bg-[#2f2d2b] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={handleTagSubmit}
                  className="rounded-[14px] border border-rose-200 bg-white px-3 py-2.5 text-sm font-medium text-[#8a6b6b] hover:bg-rose-50"
                >
                  +
                </button>
              </div>
            </SidebarSection>

            {/* SEO */}
            <SidebarSection
              id="seo"
              icon={Search}
              title="SEO"
              iconColor="text-[#9ba7b7]"
            >
              <label
                htmlFor="seo-title"
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a58f8f]"
              >
                Tiêu đề SEO
              </label>
              <input
                id="seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-transparent bg-[#2f2d2b] px-4 py-2.5 text-sm text-white outline-none"
              />
              <p
                className={`mt-1 text-right text-[11px] ${seoTitle.length > 60 ? "text-rose-400" : "text-[#9b8888]"}`}
              >
                {seoTitle.length} / 60
              </p>

              <label
                htmlFor="seo-desc"
                className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a58f8f]"
              >
                Mô tả
              </label>
              <textarea
                id="seo-desc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="mt-2 min-h-[80px] w-full rounded-[14px] border border-transparent bg-[#2f2d2b] px-4 py-2.5 text-sm italic leading-7 text-white outline-none"
              />
              <p
                className={`mt-1 text-right text-[11px] ${seoDescription.length > 160 ? "text-rose-400" : "text-[#9b8888]"}`}
              >
                {seoDescription.length} / 160
              </p>

              <div className="mt-4 rounded-[18px] border border-rose-100 bg-white p-4 shadow-sm">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b09292]">
                  Xem trước Google
                </p>
                <p className="text-[11px] text-[#5f8f65]">
                  becomingblooming.com › yoga
                </p>
                <p className="mt-1 text-[1.2rem] leading-[1.25] text-[#2f5bd3]">
                  {seoTitle || title}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#5d5d5d]">
                  {seoDescription || excerpt}
                </p>
              </div>
            </SidebarSection>

            {/* Options / Toggles */}
            <SidebarSection
              id="options"
              icon={Check}
              title="Tùy chọn"
              iconColor="text-sage-300"
            >
              <div className="space-y-2">
                {toggleMeta.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggle(key)}
                    className="flex w-full items-center justify-between rounded-[16px] border border-rose-100 bg-white px-4 py-3 text-left hover:border-rose-200"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-[#6f5a5a]">
                      <Icon className="h-4 w-4 text-[#aeb8c6]" />
                      {label}
                    </span>
                    <span
                      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${toggles[key] ? "bg-sage-300" : "bg-rose-100"}`}
                    >
                      <span
                        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${toggles[key] ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </SidebarSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
