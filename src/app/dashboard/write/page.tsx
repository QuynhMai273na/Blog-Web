"use client";

import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import {
  KeyboardEvent,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { X } from "lucide-react";
import { RichPostContent } from "@/components/blog/RichPostContent";
import { BLOG_CATEGORIES, type BlogCategorySlug } from "@/constants/categories";
import { createClient } from "@/lib/supabase/client";
import CustomSelect from "@/components/ui/CustomSelect";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const categoryOptions = BLOG_CATEGORIES.map((category) => ({
  label: category.label,
  value: category.slug,
}));

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
];

const averageWordsPerMinute = 220;
const defaultToggles: Record<ToggleKey, boolean> = {
  comments: true,
  featured: false,
  emailSubscribers: false,
  showHomepage: true,
};
const defaultSidebarOpen: Record<string, boolean> = {
  publish: true,
  cover: false,
  category: false,
  options: false,
};
const editorPageBackground =
  // "bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.78),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(209,231,221,0.56),transparent_32%),linear-gradient(180deg,#fdfbf6_0%,#f8f1e7_50%,#fcfaf6_100%)]";
  "bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.78),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(209,231,221,0.56),transparent_32%),radial-gradient(circle_at_12%_88%,rgba(252,228,230,0.6),transparent_34%),radial-gradient(circle_at_88%_88%,rgba(209,231,221,0.55),transparent_34%),linear-gradient(180deg,#fdfbf6_0%,#f8f1e7_50%,#fcfaf6_100%)]";

type NoticeState = {
  tone: "success" | "error";
  message: string;
  href?: string;
} | null;

type SaveIntent = "draft" | "publish";
type AssetKind = "cover" | "inline";

type UploadResponse = {
  assetId: string;
  url: string;
  path: string;
  error?: string;
};

type PostAssetRow = {
  id: string;
  kind: AssetKind;
  storage_path: string;
  public_url: string;
  status: "pending" | "attached";
};

const EditorImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      assetId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-asset-id"),
        renderHTML: (attributes) =>
          attributes.assetId ? { "data-asset-id": attributes.assetId } : {},
      },
      tempId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-upload-temp-id"),
        renderHTML: (attributes) =>
          attributes.tempId ? { "data-upload-temp-id": attributes.tempId } : {},
      },
    };
  },
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

function ActionButtons({
  disabled,
  isEditing,
  isSaving,
  onDraft,
  onCancel,
  onPreview,
  onPublish,
}: {
  disabled: boolean;
  isEditing: boolean;
  isSaving: SaveIntent | null;
  onDraft: () => void;
  onCancel: () => void;
  onPreview: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving !== null}
        className="flex-1 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-[#9a6570] transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 sm:flex-none"
      >
        Hủy
      </button>
      {!isEditing && (
        <button
          type="button"
          onClick={onDraft}
          disabled={disabled || isSaving !== null}
          className="flex-1 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-[#8a6b6b] transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 sm:flex-none"
        >
          {isSaving === "draft" ? "Đang lưu..." : "Lưu nháp"}
        </button>
      )}
      <button
        type="button"
        onClick={onPreview}
        disabled={disabled}
        className="flex-1 rounded-full border border-sage-100 bg-sage-50 px-4 py-2 text-sm font-medium text-[#64806f] transition-all duration-200 hover:border-sage-300 hover:bg-white sm:flex-none"
      >
        Xem trước
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={disabled || isSaving !== null}
        className="flex-1 rounded-full bg-sage-300 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(168,198,159,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage-800 sm:flex-none"
      >
        {isSaving === "publish"
          ? "Đang lưu..."
          : isEditing
            ? "Lưu lại"
            : "Đăng bài"}
      </button>
    </div>
  );
}

function SidebarSection({
  id,
  icon: Icon,
  title,
  iconColor,
  open,
  onToggle,
  className,
  children,
}: {
  id: string;
  icon: typeof Type;
  title: string;
  iconColor: string;
  open: boolean;
  onToggle: (id: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative rounded-[26px] border border-white/90 bg-[#fffdfb]/95 shadow-[0_16px_50px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`h-6 w-6 ${iconColor}`} />
          <span className="font-serif text-xl font-normal tracking-[1px] leading-[1.4] text-text_primary">
            {title}
          </span>
        </div>
        <span
          className={`text-sm text-text_secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-soft)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-rose-100/60 px-5 pb-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WritePage() {
  return (
    <main
      className={`${cormorant.variable} min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.78),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(209,231,221,0.56),transparent_32%),linear-gradient(180deg,#fdfbf6_0%,#f8f1e7_50%,#fcfaf6_100%)]`}
    >
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center px-4">
            <p className="font-sans text-sm text-[#7a5a55]">
              Đang tải editor...
            </p>
          </div>
        }
      >
        <WritePageContent />
      </Suspense>
    </main>
  );
}

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const sessionAssetIdsRef = useRef<Set<string>>(new Set());
  const coverObjectUrlRef = useRef<string | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [publishMode, setPublishMode] = useState<PublishMode>("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverPublicUrl, setCoverPublicUrl] = useState<string | null>(null);
  const [coverAssetId, setCoverAssetId] = useState<string | null>(null);
  const [coverAssetStatus, setCoverAssetStatus] = useState<
    "pending" | "attached" | null
  >(null);
  const [coverStoragePath, setCoverStoragePath] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [inlineUploadCount, setInlineUploadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [category, setCategory] = useState<BlogCategorySlug>(
    categoryOptions[0].value,
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [authState, setAuthState] = useState<"loading" | "admin" | "forbidden">(
    "loading",
  );
  const [notice, setNotice] = useState<NoticeState>(null);
  const [isSaving, setIsSaving] = useState<SaveIntent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [toggles, setToggles] =
    useState<Record<ToggleKey, boolean>>(defaultToggles);
  const [sidebarOpen, setSidebarOpen] =
    useState<Record<string, boolean>>(defaultSidebarOpen);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Bắt đầu câu chuyện của bạn..." }),
      EditorImage,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setWordCount(countWords(editor.getText()));
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[520px] px-2 py-1 text-[1.08rem] leading-[2.05] font-serif",
      },
      handleDrop: (view, event) => {
        const file = getFirstImageFile(event.dataTransfer?.files);
        if (!file) return false;

        event.preventDefault();
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        void handleInlineImageFile(file, coordinates?.pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const file = getFirstImageFile(event.clipboardData?.files);
        if (!file) return false;

        event.preventDefault();
        void handleInlineImageFile(file);
        return true;
      },
    },
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setAuthState("forbidden");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("app_role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (error) {
        console.error("[write.admin.load]", error);
      }

      setAuthState(profile?.app_role === "admin" ? "admin" : "forbidden");
    });
  }, []);

  useEffect(() => {
    return () => {
      if (coverObjectUrlRef.current) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!editSlug || authState !== "admin" || !editor) return;

    fetch(`/api/admin/posts/${editSlug}`)
      .then(async (response) => {
        const result = (await response.json().catch(() => null)) as {
          post?: {
            id: string;
            title: string;
            summary: string | null;
            content: string | null;
            content_json?: unknown;
            thumbnail_url: string | null;
            tags?: string[] | null;
            allow_comments?: boolean | null;
            is_featured?: boolean | null;
            assets?: PostAssetRow[];
            status: PublishMode;
            published_at: string | null;
            categories:
              | { slug: BlogCategorySlug | null }
              | Array<{ slug: BlogCategorySlug | null }>
              | null;
          };
          error?: string;
        } | null;

        if (!response.ok || !result?.post) {
          setNotice({
            tone: "error",
            message: result?.error ?? "Không thể tải bài viết cần sửa.",
          });
          return;
        }

        const post = result.post;
        const postCategory = Array.isArray(post.categories)
          ? post.categories[0]
          : post.categories;

        setEditingPostId(post.id);
        setTitle(post.title);
        setExcerpt(post.summary ?? "");
        setCategory(postCategory?.slug ?? categoryOptions[0].value);
        setPublishMode(post.status ?? "draft");
        setScheduledAt(toDatetimeLocalValue(post.published_at));
        setTags(post.tags ?? []);
        setToggles((current) => ({
          ...current,
          comments: post.allow_comments ?? true,
          featured: post.is_featured ?? false,
        }));
        setCoverImage(post.thumbnail_url ?? null);
        setCoverPublicUrl(post.thumbnail_url ?? null);
        const coverAsset = (post.assets ?? []).find(
          (asset) =>
            asset.kind === "cover" && asset.public_url === post.thumbnail_url,
        );
        setCoverAssetId(coverAsset?.id ?? null);
        setCoverAssetStatus(coverAsset ? "attached" : null);
        setCoverStoragePath(coverAsset?.storage_path ?? "");
        editor.commands.setContent(
          isTiptapDocument(post.content_json)
            ? (post.content_json as Parameters<
                typeof editor.commands.setContent
              >[0])
            : plainContentToHtml(post.content ?? ""),
        );
        setWordCount(countWords(editor.getText()));
      })
      .catch((error: unknown) => {
        console.error("[write.edit.load]", error);
        setNotice({
          tone: "error",
          message: "Không thể tải bài viết cần sửa.",
        });
      });
  }, [authState, editSlug, editor]);

  const activeFormats = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor?.isActive("bold") ?? false,
      italic: ctx.editor?.isActive("italic") ?? false,
      underline: ctx.editor?.isActive("underline") ?? false,
      h2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      h3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
      blockquote: ctx.editor?.isActive("blockquote") ?? false,
      bulletList: ctx.editor?.isActive("bulletList") ?? false,
      orderedList: ctx.editor?.isActive("orderedList") ?? false,
      link: ctx.editor?.isActive("link") ?? false,
      alignLeft: ctx.editor?.isActive({ textAlign: "left" }) ?? false,
      alignCenter: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
      alignRight: ctx.editor?.isActive({ textAlign: "right" }) ?? false,
    }),
  });

  const readTime = Math.max(1, Math.ceil(wordCount / averageWordsPerMinute));
  const hasActiveUploads = isCoverUploading || inlineUploadCount > 0;

  function insertImageUrl() {
    inlineFileInputRef.current?.click();
  }

  function insertLinkUrl() {
    const url = window.prompt("Dán URL link")?.trim();
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  }

  async function uploadImageAsset(file: File, kind: AssetKind) {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });

    const result = (await response
      .json()
      .catch(() => null)) as UploadResponse | null;

    if (!response.ok || !result?.assetId || !result.url) {
      throw new Error(result?.error ?? "Khong the tai anh.");
    }

    sessionAssetIdsRef.current.add(result.assetId);
    return result;
  }

  async function deleteAsset(assetId: string) {
    const response = await fetch(`/api/admin/uploads/${assetId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("[write.asset.delete]", await response.text());
      return;
    }

    sessionAssetIdsRef.current.delete(assetId);
  }

  async function cleanupPendingAssets() {
    const pendingIds = Array.from(sessionAssetIdsRef.current);
    await Promise.allSettled(pendingIds.map((assetId) => deleteAsset(assetId)));
  }

  async function handleCancel() {
    await cleanupPendingAssets();
    router.push("/dashboard");
  }

  function resetEditorForm() {
    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }

    sessionAssetIdsRef.current.clear();
    setEditingPostId(null);
    setTitle("");
    setExcerpt("");
    setPublishMode("draft");
    setScheduledAt("");
    setCoverImage(null);
    setCoverPublicUrl(null);
    setCoverAssetId(null);
    setCoverAssetStatus(null);
    setCoverStoragePath("");
    setCoverFileName("");
    setIsCoverUploading(false);
    setInlineUploadCount(0);
    setIsDragging(false);
    setWordCount(0);
    setCategory(categoryOptions[0].value);
    setTagInput("");
    setTags([]);
    setToggles(defaultToggles);
    setSidebarOpen(defaultSidebarOpen);
    editor?.commands.clearContent();
  }

  function scrollToActionBar() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      });
    });
  }

  async function handleFile(file: File | null) {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setNotice({ tone: "error", message: validationError });
      return;
    }

    const previousCover = {
      image: coverImage,
      publicUrl: coverPublicUrl,
      assetId: coverAssetId,
      status: coverAssetStatus,
      storagePath: coverStoragePath,
      fileName: coverFileName,
    };

    if (previousCover.status === "pending" && previousCover.assetId) {
      await deleteAsset(previousCover.assetId);
    }

    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    coverObjectUrlRef.current = previewUrl;
    setCoverFileName(file.name);
    setCoverImage(previewUrl);
    setCoverPublicUrl(null);
    setCoverAssetId(null);
    setCoverAssetStatus(null);
    setCoverStoragePath("");
    setIsCoverUploading(true);

    try {
      const result = await uploadImageAsset(file, "cover");
      setCoverImage(result.url);
      setCoverPublicUrl(result.url);
      setCoverAssetId(result.assetId);
      setCoverAssetStatus("pending");
      setCoverStoragePath(result.path);
      URL.revokeObjectURL(previewUrl);
      coverObjectUrlRef.current = null;
    } catch (error) {
      console.error("[write.cover.upload]", error);
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Khong the tai anh bia.",
      });
      setCoverImage(previousCover.image);
      setCoverPublicUrl(previousCover.publicUrl);
      setCoverAssetId(previousCover.assetId);
      setCoverAssetStatus(previousCover.status);
      setCoverStoragePath(previousCover.storagePath);
      setCoverFileName(previousCover.fileName);
      URL.revokeObjectURL(previewUrl);
      coverObjectUrlRef.current = null;
    } finally {
      setIsCoverUploading(false);
    }
  }

  async function handleRemoveCover() {
    if (coverAssetStatus === "pending" && coverAssetId) {
      await deleteAsset(coverAssetId);
    }

    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }

    setCoverImage(null);
    setCoverPublicUrl(null);
    setCoverAssetId(null);
    setCoverAssetStatus(null);
    setCoverStoragePath("");
    setCoverFileName("");
  }

  async function handleInlineImageFile(file: File | null, position?: number) {
    if (!file || !editor) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setNotice({ tone: "error", message: validationError });
      return;
    }

    const tempId = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);
    const imageNode = {
      type: "image",
      attrs: {
        src: previewUrl,
        alt: file.name,
        title: null,
        assetId: null,
        tempId,
      },
    };

    if (typeof position === "number") {
      editor.chain().focus().insertContentAt(position, imageNode).run();
    } else {
      editor.chain().focus().insertContent(imageNode).run();
    }

    setInlineUploadCount((count) => count + 1);
    try {
      const result = await uploadImageAsset(file, "inline");
      const replaced = replaceEditorImage(tempId, {
        src: result.url,
        assetId: result.assetId,
        tempId: null,
        alt: file.name,
      });

      if (!replaced) {
        await deleteAsset(result.assetId);
      }
    } catch (error) {
      console.error("[write.inline.upload]", error);
      removeEditorImage(tempId);
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Khong the tai anh.",
      });
    } finally {
      URL.revokeObjectURL(previewUrl);
      setInlineUploadCount((count) => Math.max(0, count - 1));
    }
  }

  function replaceEditorImage(
    tempId: string,
    attrs: { src: string; assetId: string; tempId: null; alt: string },
  ) {
    if (!editor) return false;

    let replaced = false;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name !== "image" || node.attrs.tempId !== tempId) {
        return true;
      }

      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...attrs,
        }),
      );
      replaced = true;
      return false;
    });

    return replaced;
  }

  function removeEditorImage(tempId: string) {
    if (!editor) return false;

    let removed = false;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name !== "image" || node.attrs.tempId !== tempId) {
        return true;
      }

      editor.view.dispatch(editor.state.tr.delete(pos, pos + node.nodeSize));
      removed = true;
      return false;
    });

    return removed;
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

  async function handleSubmit(intent: SaveIntent) {
    setNotice(null);
    const contentJson = editor?.getJSON() ?? null;
    const plainContent = toPlainPostContent(contentJson);

    const validationError = validatePost({
      title,
      excerpt,
      content: editor?.getText() ?? "",
      publishMode: intent === "draft" ? "draft" : publishMode,
      scheduledAt,
    });

    if (validationError) {
      setNotice({ tone: "error", message: validationError });
      return;
    }

    if (hasActiveUploads || hasUnresolvedEditorImages(contentJson)) {
      setNotice({
        tone: "error",
        message: "Vui long doi anh tai len xong truoc khi luu.",
      });
      return;
    }

    const wasEditing = Boolean(editingPostId);
    setIsSaving(intent);
    const requestedMode = intent === "draft" ? "draft" : publishMode;
    const shouldEmailSubscribers =
      !editingPostId && requestedMode !== "draft" && toggles.emailSubscribers;
    const response = await fetch(
      editingPostId ? `/api/admin/posts/${editingPostId}` : "/api/admin/posts",
      {
        method: editingPostId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content: plainContent,
          contentJson,
          category,
          tags,
          thumbnailUrl: coverPublicUrl,
          coverAssetId,
          uploadedAssetIds: Array.from(sessionAssetIdsRef.current),
          publishMode: requestedMode,
          scheduledAt: requestedMode === "scheduled" ? scheduledAt : null,
          options: {
            comments: toggles.comments,
            featured: toggles.featured,
            emailSubscribers: shouldEmailSubscribers,
          },
        }),
      },
    );

    const result = (await response.json().catch(() => null)) as {
      error?: string;
      post?: { slug: string; status: string };
      notification?: {
        requested: boolean;
        sent: number;
        failed: number;
        skippedReason?: string;
      };
    } | null;

    setIsSaving(null);

    if (!response.ok || !result?.post) {
      setNotice({
        tone: "error",
        message: result?.error ?? "Không thể lưu bài viết.",
      });
      return;
    }

    const successNotice: NoticeState = {
      tone: "success",
      message: wasEditing
        ? "Bài viết đã được cập nhật."
        : result.post.status === "published"
          ? "Bài viết đã được đăng."
          : result.post.status === "scheduled"
            ? "Bài viết đã được lên lịch."
            : "Bản nháp đã được lưu.",
      href:
        result.post.status === "published"
          ? `/posts/${result.post.slug}`
          : "/dashboard",
    };
    if (result.notification?.requested) {
      successNotice.message = appendSubscriberNotificationMessage(
        successNotice.message,
        result.notification,
      );
    }

    resetEditorForm();
    setNotice(successNotice);

    if (result.post.status === "published") {
      router.refresh();
    }

    if (wasEditing) {
      window.history.replaceState(null, "", "/dashboard/write");
    }

    scrollToActionBar();
  }

  if (authState === "loading") {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <p className="font-sans text-sm text-[#7a5a55]">
          Đang kiểm tra quyền admin...
        </p>
      </div>
    );
  }

  if (authState === "forbidden") {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <section className="w-full max-w-md rounded-[20px] border border-[#f0e6e0] bg-white p-8 text-center shadow-[0_4px_32px_rgba(74,44,42,0.07)]">
          <h1 className="font-serif text-2xl font-semibold text-[#3a2520]">
            Chỉ admin mới được viết bài
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#8a7474]">
            Tài khoản hiện tại không có quyền truy cập trang tạo bài mới.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#c9606e] px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-[#e8768a]"
          >
            Về trang chủ
          </Link>
        </section>
      </div>
    );
  }

  const isSubscriberEmailEnabled = !editingPostId && publishMode !== "draft";
  const visibleToggleMeta = toggleMeta.filter(
    ({ key }) => key !== "emailSubscribers" || !editingPostId,
  );

  return (
    <div className={` ${editorPageBackground}`}>
      {/* ── page header ── */}
      <header className="relative grid gap-4 bg-white/80 px-4 py-6 shadow-[0_24px_70px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md md:px-6 lg:grid-cols-[1fr_minmax(0,2fr)_1fr] lg:items-start lg:py-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-sage-300">
            Dashboard / Editor
          </p>
        </div>

        <div className="w-full max-w-2xl text-left lg:mx-auto lg:text-center">
          <h1 className="font-serif text-3xl font-normal leading-[1.4] tracking-normal text-text_black md:text-[40px]">
            {editingPostId ? "Sửa bài viết" : "Viết bài mới"}
          </h1>
          <p className="mt-2 text-base text-[#7f6d6d]">
            {editingPostId
              ? "Cập nhật nội dung, xem trước và lưu lại thay đổi."
              : "Soạn nội dung, lưu nháp, xem trước, đăng ngay hoặc lên lịch."}
          </p>
        </div>

        <div className="rounded-[24px] border border-sage-100 bg-sage-50/80 px-5 py-4 shadow-sm lg:justify-self-end">
          <p className="font-medium text-base text-[#64806f]">
            Chỉnh sửa lần cuối
          </p>
          <p className="mt-1 text-base text-[#7c9283]">
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date())}
          </p>
        </div>
      </header>

      {/* ── Main scrollable area ── */}
      <div className="mx-auto max-w-[1440px] px-3 py-4 sm:px-4 md:px-6 md:py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── Left: writing area ── */}
          <div className="min-w-0 space-y-5 xl:pr-2">
            {/* Toolbar */}
            <div className="sticky top-0 z-30 rounded-[22px] border border-white/90 bg-white/95 px-3 py-3 shadow-[0_8px_30px_rgba(45,62,47,0.08)] ring-1 ring-rose-100/70 backdrop-blur-md md:rounded-[26px] md:px-4">
              <input
                ref={inlineFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  void handleInlineImageFile(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                <ToolbarBtn
                  label="H2"
                  icon={Heading2}
                  active={activeFormats?.h2 ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                />
                <ToolbarBtn
                  label="H3"
                  icon={Heading3}
                  active={activeFormats?.h3 ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Đậm"
                  icon={Bold}
                  active={activeFormats?.bold ?? false}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolbarBtn
                  label="Nghiêng"
                  icon={Italic}
                  active={activeFormats?.italic ?? false}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                />
                <ToolbarBtn
                  label="Gạch"
                  icon={UnderlineIcon}
                  active={activeFormats?.underline ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Trái"
                  icon={AlignLeft}
                  active={activeFormats?.alignLeft ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                />
                <ToolbarBtn
                  label="Giữa"
                  icon={AlignCenter}
                  active={activeFormats?.alignCenter ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                />
                <ToolbarBtn
                  label="Phải"
                  icon={AlignRight}
                  active={activeFormats?.alignRight ?? false}
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                />
                <div className="h-9 w-px bg-rose-100" />
                <ToolbarBtn
                  label="Quote"
                  icon={Quote}
                  active={activeFormats?.blockquote ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                />
                <ToolbarBtn
                  label="List"
                  icon={List}
                  active={activeFormats?.bulletList ?? false}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarBtn
                  label="Số"
                  icon={ListOrdered}
                  active={activeFormats?.orderedList ?? false}
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
                  active={activeFormats?.link ?? false}
                  onClick={insertLinkUrl}
                />
              </div>
            </div>

            {/* Card chính — Title + Excerpt + Editor */}
            <div className="overflow-hidden rounded-[24px] border border-white/90 bg-[#fffefd]/95 shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md md:rounded-[34px]">
              {/* Title */}
              <div className="px-5 pt-6 md:px-10 md:pt-10">
                <label
                  htmlFor="title"
                  className="text-base font-semibold uppercase tracking-[0.2em] text-text_secondary"
                >
                  Tiêu đề
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Đặt tiêu đề bài viết"
                  className="mt-3 w-full border-none bg-transparent text-2xl italic leading-[1.2] text-[#3a312f] outline-none placeholder:text-[#c4b5b1] md:text-3xl"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                />
              </div>

              <div className="mx-5 my-5 h-px bg-gradient-to-r from-rose-100 via-rose-200/60 to-transparent md:mx-10 md:my-6" />

              {/* Excerpt */}
              <div className="px-5 md:px-10">
                <label
                  htmlFor="excerpt"
                  className="text-base font-semibold uppercase tracking-[0.2em] text-text_secondary"
                >
                  Tóm tắt hiển thị ngoài danh sách
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Viết 1-2 câu mô tả ngắn"
                  className="mt-3 min-h-[72px] w-full resize-none bg-transparent font-serif text-base italic leading-[1.4] text-[#3c3331] outline-none placeholder:text-[#c4b5b1]"
                />
              </div>

              <div className="mx-5 my-5 h-px bg-gradient-to-r from-rose-100 via-rose-200/60 to-transparent md:mx-10 md:my-6" />

              {/* Tiptap editor */}
              <div className="bg-[#fdfcfb] border-t border-rose-100/60">
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-10">
                  <div>
                    <p className="text-base font-semibold uppercase tracking-[0.2em] text-text_secondary">
                      Nội dung chính
                    </p>
                    <p className="mt-0.5 font-serif text-base tracking-normal italic leading-[1.4] text-[#c6b7b3]">
                      Viết như Word — chọn text để format
                    </p>
                  </div>
                  <div className="rounded-full border border-rose-100 bg-rose-50/60 px-3 py-1.5 text-[11px] text-[#a07878]">
                    {hasActiveUploads
                      ? "Dang tai anh..."
                      : `${wordCount} từ · ~${readTime} phút`}
                  </div>
                </div>
                <div className="px-4 pb-5 md:px-10 md:pb-10">
                  <div
                    className="max-h-[640px] min-h-[360px] cursor-text overflow-y-auto overscroll-contain rounded-[20px] border border-rose-100 bg-white px-4 py-4 shadow-[inset_0_2px_8px_rgba(180,140,140,0.06),0_2px_12px_rgba(180,140,140,0.08)] transition-shadow duration-200 hover:shadow-[inset_0_2px_8px_rgba(180,140,140,0.08),0_6px_20px_rgba(180,140,140,0.14)] focus-within:border-rose-200 focus-within:shadow-[inset_0_2px_8px_rgba(180,140,140,0.08),0_6px_24px_rgba(214,156,161,0.18)] md:min-h-[520px] md:px-6 md:py-5"
                    onClick={() => editor?.commands.focus()}
                  >
                    <EditorContent
                      editor={editor}
                      className="
                        [&_.ProseMirror]:outline-none
                        [&_.ProseMirror]:min-h-[320px]
                        md:[&_.ProseMirror]:min-h-[480px]
                        [&_.ProseMirror]:text-[#3a312f]
                        [&_.ProseMirror]:leading-[2]
                        [&_.ProseMirror]:break-words
                        [&_.ProseMirror]:[overflow-wrap:anywhere]
                        [&_.ProseMirror_p]:mb-4
                        [&_.ProseMirror_p]:text-[1.05rem]
                        [&_.ProseMirror_p]:break-words
                        [&_.ProseMirror_p]:[overflow-wrap:anywhere]
                        [&_.ProseMirror_h2]:font-serif
                        [&_.ProseMirror_h2]:text-[1.6rem]
                        [&_.ProseMirror_h2]:font-semibold
                        [&_.ProseMirror_h2]:text-[#3a312f]
                        [&_.ProseMirror_h2]:mt-8
                        [&_.ProseMirror_h2]:mb-3
                        [&_.ProseMirror_h3]:font-serif
                        [&_.ProseMirror_h3]:text-[1.28rem]
                        [&_.ProseMirror_h3]:font-semibold
                        [&_.ProseMirror_h3]:text-[#3a312f]
                        [&_.ProseMirror_h3]:mt-6
                        [&_.ProseMirror_h3]:mb-2
                        [&_.ProseMirror_blockquote]:border-l-[3px]
                        [&_.ProseMirror_blockquote]:border-rose-300
                        [&_.ProseMirror_blockquote]:pl-5
                        [&_.ProseMirror_blockquote]:italic
                        [&_.ProseMirror_blockquote]:text-[#7a6666]
                        [&_.ProseMirror_blockquote]:my-5
                        [&_.ProseMirror_ul]:my-5
                        [&_.ProseMirror_ul]:list-disc
                        [&_.ProseMirror_ul]:pl-7
                        [&_.ProseMirror_ol]:my-5
                        [&_.ProseMirror_ol]:list-decimal
                        [&_.ProseMirror_ol]:pl-7
                        [&_.ProseMirror_li]:my-1
                        [&_.ProseMirror_li]:pl-1
                        [&_.ProseMirror_li]:text-[1.05rem]
                        [&_.ProseMirror_li]:leading-8
                        [&_.ProseMirror_li_p]:mb-0
                        [&_.ProseMirror_li_p]:text-inherit
                        [&_.ProseMirror_a]:text-rose-400
                        [&_.ProseMirror_a]:underline
                        [&_.ProseMirror_img]:my-6
                        [&_.ProseMirror_img]:mx-auto
                        [&_.ProseMirror_img]:block
                        [&_.ProseMirror_img]:max-h-[360px]
                        [&_.ProseMirror_img]:w-full
                        [&_.ProseMirror_img]:max-w-[420px]
                        [&_.ProseMirror_img]:rounded-[18px]
                        [&_.ProseMirror_img]:object-contain
                        [&_.ProseMirror_img[data-upload-temp-id]]:opacity-60
                        [&_.ProseMirror_.is-editor-empty:first-child::before]:text-[#c4b5b1]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col gap-4 rounded-[24px] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_12px_36px_rgba(45,62,47,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5 md:rounded-[28px]">
              <div className="min-w-0">
                {notice ? (
                  <p
                    className={`text-[12px] font-medium ${
                      notice.tone === "success"
                        ? "text-[#64806f]"
                        : "text-rose-500"
                    }`}
                  >
                    {notice.message}
                    {notice.href && (
                      <Link href={notice.href} className="ml-2 underline">
                        Mở
                      </Link>
                    )}
                  </p>
                ) : (
                  <p className="text-[12px] italic text-[#8b7777]">
                    Bài mới sẽ chỉ được lưu khi tài khoản admin xác nhận thao
                    tác.
                  </p>
                )}
              </div>
              <ActionButtons
                disabled={!editor || hasActiveUploads}
                isEditing={Boolean(editingPostId)}
                isSaving={isSaving}
                onDraft={() => void handleSubmit("draft")}
                onCancel={() => void handleCancel()}
                onPreview={() => setIsPreviewOpen(true)}
                onPublish={() => void handleSubmit("publish")}
              />
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-3 xl:sticky xl:top-4 xl:self-start">
            <SidebarSection
              id="publish"
              icon={CalendarDays}
              title="Trạng thái đăng"
              iconColor="text-rose-300"
              open={sidebarOpen.publish}
              onToggle={toggleSidebar}
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
                        <span className="text-base font-semibold text-text_secondary">
                          {option.label}
                        </span>
                      </span>
                      <span className="text-sm text-text_secondary">
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

            <SidebarSection
              id="cover"
              icon={ImageIcon}
              title="Ảnh bìa"
              iconColor="text-sage-300"
              open={sidebarOpen.cover}
              onToggle={toggleSidebar}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  void handleFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
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
                  void handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex w-full flex-col items-center justify-center rounded-[20px] border border-dashed px-4 py-6 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-rose-300 bg-rose-50"
                    : "border-rose-200 bg-white hover:border-rose-300 hover:bg-rose-50/40"
                }`}
              >
                {coverImage ? (
                  <div className="w-full">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className={`h-36 w-full rounded-[16px] object-cover ${
                        isCoverUploading ? "opacity-60" : ""
                      }`}
                    />
                    {isCoverUploading && (
                      <p className="mt-2 text-[11px] font-semibold text-[#9a6570]">
                        Dang tai anh...
                      </p>
                    )}
                  </div>
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
              {coverImage && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCoverUploading}
                    className="flex-1 rounded-[14px] border border-sage-100 bg-sage-50 px-3 py-2 text-xs font-medium text-[#64806f] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemoveCover()}
                    disabled={isCoverUploading}
                    className="flex-1 rounded-[14px] border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-[#be123c] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </SidebarSection>

            <SidebarSection
              id="category"
              icon={Type}
              title="Phân loại - Tags"
              iconColor="text-[#d5ab72]"
              open={sidebarOpen.category}
              onToggle={toggleSidebar}
              className="z-30"
            >
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a58f8f]">
                Danh mục chính
              </label>
              <div className="relative mt-2">
                <CustomSelect
                  options={categoryOptions}
                  value={category}
                  onChange={(value) => setCategory(value as BlogCategorySlug)}
                  buttonClassName="rounded-[14px] border-transparent bg-[#2f2d2b] px-4 py-3 text-[14px] font-medium text-white shadow-none focus:border-rose-300"
                  panelClassName="rounded-[14px]"
                />
              </div>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.22em] text-[#a58f8f]">
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

            <SidebarSection
              id="options"
              icon={Check}
              title="Tùy chọn"
              iconColor="text-sage-300"
              open={sidebarOpen.options}
              onToggle={toggleSidebar}
            >
              <div className="space-y-2">
                {visibleToggleMeta.map(({ key, label, icon: Icon }) => {
                  const disabled =
                    key === "emailSubscribers" && !isSubscriberEmailEnabled;
                  const checked = toggles[key] && !disabled;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (!disabled) handleToggle(key);
                      }}
                      disabled={disabled}
                      title={
                        disabled
                          ? "Chỉ gửi email khi tạo bài mới với trạng thái Đăng ngay hoặc Lên lịch."
                          : undefined
                      }
                      className={`flex w-full items-center justify-between rounded-[16px] border border-rose-100 bg-white px-4 py-3 text-left hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-55`}
                    >
                      <span className="flex items-center gap-2.5 text-base text-[#6f5a5a]">
                        <Icon className="h-4 w-4 text-[#aeb8c6]" />
                        {label}
                      </span>
                      <span
                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? "bg-sage-300" : "bg-rose-100"}`}
                      >
                        <span
                          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-1"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </SidebarSection>
          </aside>
        </div>
      </div>

      {isPreviewOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-[#fdfbf6]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rose-100 bg-white/95 px-5 py-3 shadow-[0_12px_30px_rgba(45,62,47,0.08)] backdrop-blur-md">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b09292]">
                  Xem trước bài viết
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#5c4747]">
                  {title || "Chưa có tiêu đề"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white text-[#9a6570] hover:bg-rose-50"
                aria-label="Đóng xem trước"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100vh-65px)] overflow-y-auto">
              <section className="border-b border-rose-100/80 bg-white/95 px-4 pb-16 pt-8 shadow-[0_12px_40px_rgba(45,62,47,0.04)] md:px-6 md:pt-10">
                <header className="mx-auto max-w-4xl text-center">
                  <span className="inline-flex rounded-full border border-sage-100 bg-sage-50 px-4 py-1.5 text-[12px] font-medium text-[#6c8f7a] shadow-sm">
                    {
                      categoryOptions.find(
                        (option) => option.value === category,
                      )?.label
                    }
                  </span>
                  <h1 className="mx-auto mt-6 max-w-4xl font-serif text-[2.5rem] font-normal leading-[1.24] text-[#3d2f2f] md:text-[4rem]">
                    {title || "Chưa có tiêu đề"}
                  </h1>
                  <p className="mx-auto mt-5 max-w-3xl font-serif text-lg italic leading-8 text-[#6a5555]">
                    {excerpt || "Chưa có tóm tắt."}
                  </p>
                </header>
              </section>
              <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
                {coverImage && (
                  <img
                    src={coverImage}
                    alt=""
                    className="mb-8 aspect-video w-full rounded-[28px] object-cover shadow-[0_20px_60px_rgba(45,62,47,0.14)]"
                  />
                )}
                <article className="max-w-none overflow-hidden rounded-[28px] border border-white/90 bg-[#fffefd]/95 p-7 text-[#3a312f] shadow-[0_24px_70px_rgba(45,62,47,0.1)] md:p-10">
                  <RichPostContent
                    contentJson={editor?.getJSON() ?? null}
                    fallbackContent={toPlainPostContent(editor?.getJSON())}
                  />
                </article>
              </main>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function validateImageFile(file: File) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return "Vui lòng chọn ảnh JPG, PNG hoặc WEBP.";
  }

  if (file.size > 8 * 1024 * 1024) {
    return "Ảnh không được quá 8MB.";
  }

  return null;
}

function getFirstImageFile(files: FileList | null | undefined) {
  return Array.from(files ?? []).find((file) => file.type.startsWith("image/"));
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isTiptapDocument(value: unknown) {
  return Boolean(
    value &&
    typeof value === "object" &&
    (value as { type?: unknown }).type === "doc",
  );
}

function hasUnresolvedEditorImages(doc: unknown) {
  let hasUnresolved = false;

  function visit(node: unknown) {
    if (hasUnresolved || !node || typeof node !== "object") return;

    const item = node as {
      type?: string;
      attrs?: { src?: unknown; tempId?: unknown };
      content?: unknown[];
    };

    if (item.type === "image") {
      const src = typeof item.attrs?.src === "string" ? item.attrs.src : "";
      if (
        src.startsWith("blob:") ||
        src.startsWith("data:image/") ||
        typeof item.attrs?.tempId === "string"
      ) {
        hasUnresolved = true;
        return;
      }
    }

    for (const child of item.content ?? []) {
      visit(child);
    }
  }

  visit(doc);
  return hasUnresolved;
}

function appendSubscriberNotificationMessage(
  baseMessage: string,
  notification: {
    requested: boolean;
    sent: number;
    failed: number;
    skippedReason?: string;
  },
) {
  if (notification.sent > 0 && notification.failed === 0) {
    return `${baseMessage} Đã gửi email cho ${notification.sent} subscriber.`;
  }

  if (notification.sent > 0) {
    return `${baseMessage} Đã gửi email cho ${notification.sent} subscriber, ${notification.failed} email bị lỗi.`;
  }

  if (
    notification.skippedReason ===
    "Email will be sent when the scheduled post is published."
  ) {
    return `${baseMessage} Email thông báo sẽ được gửi đến subscriber khi bài viết được publish.`;
  }

  return `${baseMessage} Chưa gửi được email cho subscriber${
    notification.skippedReason ? `: ${notification.skippedReason}` : "."
  }`;
}

function validatePost({
  title,
  excerpt,
  content,
  publishMode,
  scheduledAt,
}: {
  title: string;
  excerpt: string;
  content: string;
  publishMode: PublishMode;
  scheduledAt: string;
}) {
  if (!title.trim()) return "Vui lòng nhập tiêu đề bài viết.";
  if (!excerpt.trim()) return "Vui lòng nhập tóm tắt bài viết.";
  if (!content.trim()) return "Vui lòng nhập nội dung bài viết.";
  if (publishMode === "scheduled" && !scheduledAt) {
    return "Vui lòng chọn ngày giờ đăng khi lên lịch.";
  }
  if (
    publishMode === "scheduled" &&
    new Date(scheduledAt).getTime() <= Date.now()
  ) {
    return "Ngày giờ lên lịch phải nằm trong tương lai.";
  }
  return null;
}

function toPlainPostContent(doc: unknown) {
  if (!doc || typeof doc !== "object" || !("content" in doc)) {
    return "";
  }

  const nodes = (doc as { content?: unknown[] }).content ?? [];
  return nodes.map(nodeToText).filter(Boolean).join("\n\n");
}

function nodeToText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const item = node as {
    type?: string;
    attrs?: { level?: number };
    content?: unknown[];
    text?: string;
  };
  const text = (item.content ?? []).map(nodeToText).join("");

  if (item.type === "text") return item.text ?? "";
  if (item.type === "heading")
    return `${"#".repeat(item.attrs?.level ?? 2)} ${text}`.trim();
  if (item.type === "blockquote") return text ? `> ${text}` : "";
  if (item.type === "bulletList" || item.type === "orderedList") return text;
  if (item.type === "listItem") return text ? `- ${text}` : "";
  return text;
}

function toDatetimeLocalValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function plainContentToHtml(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("### "))
        return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## "))
        return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("> "))
        return `<blockquote><p>${escapeHtml(trimmed.slice(2))}</p></blockquote>`;
      return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
