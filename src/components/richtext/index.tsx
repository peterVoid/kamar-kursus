"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorHeader } from "./editor-header";
import TextAlign from "@tiptap/extension-text-align";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function RichTextEdtitor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4 ",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    content: value ? JSON.parse(value) : "",
    immediatelyRender: false,
  });

  return (
    <div className="border">
      <EditorHeader editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
