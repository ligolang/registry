import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

type props = { article: string };
export function Package({ article }: props) {
  return (
    <article>
      {article === "" ? (
        <p className="text-center">No Readme found!</p>
      ) : (
        <ReactMarkdown
          children={"#" + article.split("#").slice(1).join("#")}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
          remarkPlugins={[remarkGfm]}
        />
      )}
    </article>
  );
}
