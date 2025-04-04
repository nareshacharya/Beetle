// components/editor/LexicalEditor.tsx
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./ToolbarPlugin";

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    code: "bg-gray-100 text-sm px-1 rounded text-pink-600 font-mono",
  },
  heading: {
    h1: "text-2xl font-bold mt-4 mb-2",
    h2: "text-xl font-semibold mt-3 mb-2",
  },
  list: {
    ul: "list-disc ml-5",
    ol: "list-decimal ml-5",
  },
};

const editorConfig = {
  namespace: "RichTextEditor",
  theme,
  onError(error: any) {
    console.error("Lexical error:", error);
  },
};

type Props = {
  onChange?: (editorState: string) => void;
  placeholder?: string;
};

const LexicalEditor = ({
  onChange,
  placeholder = "Start typing...",
}: Props) => {
  return (
    <div className="border p-2 rounded shadow bg-white">
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[150px] p-2 outline-none" />
          }
          placeholder={<div className="text-gray-400 px-2">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const json = editorState.toJSON();
              if (onChange) onChange(JSON.stringify(json));
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
