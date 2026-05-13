import type { ReactNode } from "react";

type RichNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: RichNode[];
};

export function RichPostContent({
  contentJson,
  fallbackContent,
}: {
  contentJson: unknown;
  fallbackContent: string;
}) {
  const doc = isRichNode(contentJson) ? contentJson : null;
  const nodes = doc?.content;

  if (Array.isArray(nodes) && nodes.length > 0) {
    return (
      <div className="break-words [overflow-wrap:anywhere]">
        {nodes.map((node, index) => renderNode(node, `node-${index}`))}
      </div>
    );
  }

  return (
    <div className="break-words [overflow-wrap:anywhere]">
      {renderPlainContent(fallbackContent)}
    </div>
  );
}

function renderNode(node: RichNode, key: string): ReactNode {
  const children = (node.content ?? []).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (node.type) {
    case "paragraph":
      return (
        <p
          key={key}
          className="mb-5 break-words text-base leading-8 text-[#6a5555] [overflow-wrap:anywhere]"
        >
          {children.length > 0 ? children : <br />}
        </p>
      );
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      if (level === 3) {
        return (
          <h3
            key={key}
            className="mb-3 mt-10 break-words font-sans text-base font-semibold text-text_primary [overflow-wrap:anywhere]"
          >
            {children}
          </h3>
        );
      }

      return (
        <h2
          key={key}
          className="mb-3 mt-10 break-words font-sans text-lg font-semibold text-text_primary [overflow-wrap:anywhere]"
        >
          {children}
        </h2>
      );
    }
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-5 border-l-[3px] border-rose-300 pl-5 font-serif italic text-[#7a6666] [&_p]:mb-0 [&_p]:text-inherit"
        >
          {children}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul
          key={key}
          className="my-5 list-disc space-y-2 pl-7 text-[#6a5555]"
        >
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol
          key={key}
          className="my-5 list-decimal space-y-2 pl-7 text-[#6a5555]"
        >
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li
          key={key}
          className="break-words leading-8 [overflow-wrap:anywhere] [&_p]:mb-0 [&_p]:text-inherit"
        >
          {children}
        </li>
      );
    case "hardBreak":
      return <br key={key} />;
    case "image":
      return renderImage(node, key);
    case "text":
      return applyMarks(node.text ?? "", node.marks ?? [], key);
    default:
      return children.length > 0 ? <div key={key}>{children}</div> : null;
  }
}

function renderImage(node: RichNode, key: string) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  if (!isSafeImageSrc(src)) return null;

  const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
  const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";

  return (
    <figure key={key} className="my-7 flex flex-col items-center">
      <img
        src={src}
        alt={alt}
        className="max-h-[360px] w-full max-w-[420px] rounded-[18px] object-contain shadow-[0_14px_36px_rgba(45,62,47,0.1)] md:max-w-[52%]"
      />
      {title && (
        <figcaption className="mt-2 text-center text-xs italic text-[#9b8888]">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

function applyMarks(
  text: string,
  marks: NonNullable<RichNode["marks"]>,
  key: string,
) {
  let element: ReactNode = text;

  marks.forEach((mark, index) => {
    const markKey = `${key}-mark-${index}`;

    if (mark.type === "bold") {
      element = <strong key={markKey}>{element}</strong>;
      return;
    }

    if (mark.type === "italic") {
      element = <em key={markKey}>{element}</em>;
      return;
    }

    if (mark.type === "underline") {
      element = (
        <span key={markKey} className="underline underline-offset-4">
          {element}
        </span>
      );
      return;
    }

    if (mark.type === "link") {
      const href =
        typeof mark.attrs?.href === "string" ? mark.attrs.href.trim() : "";
      if (!isSafeHref(href)) return;

      element = (
        <a
          key={markKey}
          href={href}
          rel="noreferrer"
          target={href.startsWith("/") ? undefined : "_blank"}
          className="text-rose-400 underline decoration-rose-200 underline-offset-4"
        >
          {element}
        </a>
      );
    }
  });

  return element;
}

function renderPlainContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mb-3 mt-10 font-sans text-base font-semibold text-text_primary"
          >
            {trimmed.slice(4)}
          </h3>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mb-3 mt-10 font-sans text-lg font-semibold text-text_primary"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }

      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={index}
            className="my-5 border-l-[3px] border-rose-300 pl-5 font-serif italic text-[#7a6666]"
          >
            {trimmed.slice(2)}
          </blockquote>
        );
      }

      return (
        <p
          key={index}
          className="mb-5 whitespace-pre-line break-words text-base leading-8 text-[#6a5555] [overflow-wrap:anywhere]"
        >
          {trimmed}
        </p>
      );
    });
}

function isRichNode(value: unknown): value is RichNode {
  return Boolean(value && typeof value === "object" && "type" in value);
}

function isSafeImageSrc(src: string) {
  return src.startsWith("https://") || src.startsWith("http://") || src.startsWith("/");
}

function isSafeHref(href: string) {
  return (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("/") ||
    href.startsWith("mailto:")
  );
}
