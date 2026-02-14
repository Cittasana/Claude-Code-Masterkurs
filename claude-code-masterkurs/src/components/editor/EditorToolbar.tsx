import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const addImage = () => {
    const url = window.prompt('Bild-URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Link-URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Fett"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Kursiv"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Durchgestrichen"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('code') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Überschrift 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Überschrift 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Überschrift 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Aufzählungsliste"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Nummerierte Liste"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Zitat"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      {/* Code Block */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </button>
      </div>

      {/* Links & Images */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={setLink}
          className={`rounded p-2 transition-colors hover:bg-gray-100 ${
            editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''
          }`}
          title="Link einfügen"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          onClick={addImage}
          className="rounded p-2 transition-colors hover:bg-gray-100"
          title="Bild einfügen"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          title="Rückgängig"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          title="Wiederholen"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
