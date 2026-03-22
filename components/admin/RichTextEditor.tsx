"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
    const [showToolbar, setShowToolbar] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-slate-300 pl-4 italic my-6 text-slate-600',
                    },
                },
                link: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-8',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-8 prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-10 prose-headings:mb-6 prose-h1:text-4xl prose-h1:leading-tight prose-h2:text-3xl prose-h2:leading-tight prose-h3:text-2xl prose-h3:leading-tight prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:my-8 prose-ol:my-8 prose-li:my-3 prose-li:text-lg prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-slate-600 prose-blockquote:text-lg prose-a:text-slate-900 prose-a:underline prose-a:decoration-slate-300 hover:prose-a:decoration-slate-900 prose-img:rounded-lg prose-img:my-10 prose-img:shadow-md prose-hr:my-10 prose-hr:border-slate-200',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    editor?.chain().focus().setImage({ src: base64 }).run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!editor) {
        return null;
    }

    return (
            <div className="border border-slate-200 rounded-lg bg-white focus-within:border-slate-400 focus-within:shadow-sm transition-all">
                <div className="border-b border-slate-200 px-4 py-2 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>{showToolbar ? 'Formatting tools ready' : 'Formatting toolbar hidden'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowToolbar(!showToolbar)}
                            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                        >
                            {showToolbar ? 'Hide' : 'Show'} Toolbar
                        </button>
                    </div>
                </div>

                {showToolbar && (
                    <div className="border-b border-slate-200 bg-slate-50/70 px-3 py-3 flex flex-wrap gap-1">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('bold') ? 'bg-slate-200' : ''
                            }`}
                            title="Bold"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4v4a4 4 0 01-4 4H6z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 014 4v4a4 4 0 01-4 4H6z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('italic') ? 'bg-slate-200' : ''
                            }`}
                            title="Italic"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </button>
                        <div className="w-px h-6 bg-slate-300 my-auto" />
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''
                            }`}
                            title="Heading 1"
                        >
                            <span className="text-xs font-bold">H1</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''
                            }`}
                            title="Heading 2"
                        >
                            <span className="text-xs font-bold">H2</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''
                            }`}
                            title="Heading 3"
                        >
                            <span className="text-xs font-bold">H3</span>
                        </button>
                        <div className="w-px h-6 bg-slate-300 my-auto" />
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('bulletList') ? 'bg-slate-200' : ''
                            }`}
                            title="Bullet List"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13m-13 6h13M3 6h.01M3 12h.01M3 18h.01" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('orderedList') ? 'bg-slate-200' : ''
                            }`}
                            title="Numbered List"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('blockquote') ? 'bg-slate-200' : ''
                            }`}
                            title="Quote"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <div className="w-px h-6 bg-slate-300 my-auto" />
                        <button
                            type="button"
                            onClick={setLink}
                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                                editor.isActive('link') ? 'bg-slate-200' : ''
                            }`}
                            title="Add Link"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            className="p-2 rounded hover:bg-slate-100 transition-colors"
                            title="Add Image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="p-2 rounded hover:bg-slate-100 transition-colors"
                            title="Horizontal Rule"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="min-h-[500px] bg-white">
                    <EditorContent editor={editor} />
                </div>
            </div>
    );
}
