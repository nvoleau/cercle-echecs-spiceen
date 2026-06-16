'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link2, ImageIcon, Quote, Minus, Loader2,
} from 'lucide-react'
import { useCallback, useState } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre article…' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none' },
    },
  })

  const uploadImage = useCallback(async () => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('folder', 'articles')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
        const { url } = await res.json()
        editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run()
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href ?? ''
    const url = window.prompt('URL du lien :', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const btn = (active: boolean, title: string, onClick: () => void, children: React.ReactNode) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-club-gold text-white' : 'text-club-gray hover:bg-gray-100 hover:text-club-dark'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-club-gold">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
        {btn(editor.isActive('bold'), 'Gras (Ctrl+B)', () => editor.chain().focus().toggleBold().run(), <Bold size={15} />)}
        {btn(editor.isActive('italic'), 'Italique (Ctrl+I)', () => editor.chain().focus().toggleItalic().run(), <Italic size={15} />)}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {btn(editor.isActive('heading', { level: 2 }), 'Titre 2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={15} />)}
        {btn(editor.isActive('heading', { level: 3 }), 'Titre 3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={15} />)}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {btn(editor.isActive('bulletList'), 'Liste à puces', () => editor.chain().focus().toggleBulletList().run(), <List size={15} />)}
        {btn(editor.isActive('orderedList'), 'Liste numérotée', () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={15} />)}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {btn(editor.isActive('link'), 'Insérer / modifier un lien', setLink, <Link2 size={15} />)}
        <button
          type="button"
          title="Insérer une image"
          onClick={uploadImage}
          disabled={uploading}
          className="p-1.5 rounded transition-colors text-club-gray hover:bg-gray-100 hover:text-club-dark disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {btn(editor.isActive('blockquote'), 'Citation', () => editor.chain().focus().toggleBlockquote().run(), <Quote size={15} />)}
        {btn(false, 'Séparateur horizontal', () => editor.chain().focus().setHorizontalRule().run(), <Minus size={15} />)}
      </div>

      {/* Zone d'édition */}
      <EditorContent editor={editor} />
    </div>
  )
}
