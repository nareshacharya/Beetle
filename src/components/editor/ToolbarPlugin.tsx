import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (command: any, value?: any) => {
    editor.dispatchCommand(command, value);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-2 border-b bg-gray-50 rounded-t text-sm">
      <button
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "bold")}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Bold
      </button>
      <button
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "italic")}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Italic
      </button>
      <button
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "underline")}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Underline
      </button>
      <button
        onClick={() => applyFormat(FORMAT_TEXT_COMMAND, "code")}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Code
      </button>
      <button
        onClick={() => {
          editor.update(() => {
            $setBlocksType($createHeadingNode("h1"));
          });
        }}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        H1
      </button>
      <button
        onClick={() => {
          editor.update(() => {
            $setBlocksType($createHeadingNode("h2"));
          });
        }}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        H2
      </button>
      <button
        onClick={() => applyFormat(INSERT_UNORDERED_LIST_COMMAND)}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        • List
      </button>
      <button
        onClick={() => applyFormat(INSERT_ORDERED_LIST_COMMAND)}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        1. List
      </button>
      <button
        onClick={() => applyFormat(REMOVE_LIST_COMMAND)}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Remove List
      </button>
    </div>
  );
};

export default ToolbarPlugin;
