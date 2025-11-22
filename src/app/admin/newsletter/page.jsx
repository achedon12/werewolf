"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, Send } from "lucide-react";
import { fromAddress, siteUrl } from "@/utils/publicEmail.js";
import dynamic from "next/dynamic";
const NewsletterEditor = dynamic(() => import("@/app/admin/newsletter/NewsletterEditor.client"), { ssr: false });

const AdminNewsletterPage = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('all');
    const [role, setRole] = useState('user');
    const [customEmails, setCustomEmails] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const editorRef = useRef();

    const defaultSignature = `<br><br><div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #64748b; font-family: Arial, sans-serif;">
        <p style="margin: 0;">Cordialement,<br><strong>L'équipe de votre application</strong></p>
        <p style="margin: 8px 0 0 0; font-size: 14px;">
            <a href="${siteUrl}" target="_blank" style="color: #3b82f6; text-decoration: none;">Visitez notre site</a> |
            <a href="mailto:${fromAddress}" target="_blank" style="color: #3b82f6; text-decoration: none;"> Nous contacter</a>
        </p>
    </div>`;

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const parseEmails = (text) =>
        text
            .split(/[\n,;]+/)
            .map(e => e.trim())
            .filter(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        let finalMessage = message;
        if (!message.includes('defaultSignature')) {
            finalMessage = message + defaultSignature;
        }

        let payload = { subject, message: finalMessage, recipientType };
        if (recipientType === 'role') payload.role = role;
        if (recipientType === 'custom') payload.emails = parseEmails(customEmails);

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Erreur serveur');
            setStatus({ type: 'success', message: `Emails envoyés: ${data.sent || 0}` });
            setSubject('');
            setMessage('');
            setCustomEmails('');
            setRecipientType('all');
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setMessage(data);
    };

    const handlePreview = () => {
        setPreviewOpen(true);
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Envoyer une newsletter
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Notifiez vos utilisateurs par e-mail
                    </p>
                </div>
                <div className="flex flex-col xs:flex-row gap-2">
                    <button
                        type="button"
                        className="btn btn-ghost flex items-center justify-center gap-2 order-2 xs:order-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={handlePreview}
                    >
                        <Eye className="h-4 w-4" /> Aperçu
                    </button>
                    <button
                        form="newsletter-form"
                        type="submit"
                        className="btn btn-primary flex items-center justify-center gap-2 order-1 xs:order-2 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                    >
                        <Send className="h-4 w-4" />
                        {loading ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
            </div>

            <form id="newsletter-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-3xl">
                <div>
                    <label className="label">
                        <span className="label-text text-gray-900 dark:text-white">Sujet</span>
                    </label>
                    <input
                        className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="Sujet de votre newsletter"
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text text-gray-900 dark:text-white">Message</span>
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                        {editorLoaded ? (
                            <div className="ck-editor-dark">
                                <NewsletterEditor
                                    data={message}
                                    onChange={handleEditorChange}
                                    onReady={(editor) => {
                                        const editorElement = editor.ui.getEditableElement();
                                        if (editorElement) {
                                            editorElement.classList.add("dark:bg-gray-800", "dark:text-white");
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <div className="loading loading-spinner loading-lg mx-auto mb-2"></div>
                                <p>Chargement de l'éditeur...</p>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Utilisez l'éditeur pour formater votre message. La signature sera ajoutée automatiquement.
                    </p>
                </div>

                <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="font-medium mb-3 text-gray-900 dark:text-white">Destinataires</p>
                    <div className="flex flex-col gap-3">
                        <label className="cursor-pointer flex items-start gap-2 text-gray-900 dark:text-white">
                            <input
                                type="radio"
                                name="recipients"
                                checked={recipientType === 'all'}
                                onChange={() => setRecipientType('all')}
                                className="mt-1 text-blue-600 dark:text-blue-400"
                            />
                            <span>Tous les utilisateurs</span>
                        </label>

                        <label className="cursor-pointer flex items-start gap-2 text-gray-900 dark:text-white">
                            <input
                                type="radio"
                                name="recipients"
                                checked={recipientType === 'role'}
                                onChange={() => setRecipientType('role')}
                                className="mt-1 text-blue-600 dark:text-blue-400"
                            />
                            <span>Utilisateurs par rôle</span>
                        </label>

                        {recipientType === 'role' && (
                            <div className="ml-6 mt-2">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="select select-bordered w-full max-w-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                >
                                    <option value="user">Utilisateur</option>
                                    <option value="moderator">Modérateur</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}

                        <label className="cursor-pointer flex items-start gap-2 text-gray-900 dark:text-white">
                            <input
                                type="radio"
                                name="recipients"
                                checked={recipientType === 'custom'}
                                onChange={() => setRecipientType('custom')}
                                className="mt-1 text-blue-600 dark:text-blue-400"
                            />
                            <span>Adresses e-mail personnalisées</span>
                        </label>

                        {recipientType === 'custom' && (
                            <div className="ml-6 mt-2">
                                <textarea
                                    placeholder="Un e-mail par ligne, ou séparés par des virgules ou points-virgules"
                                    className="textarea textarea-bordered w-full h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    value={customEmails}
                                    onChange={(e) => setCustomEmails(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Saisissez une adresse par ligne, ou séparez-les par des virgules ou points-virgules
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {status && (
                    <div className={`p-3 rounded ${
                        status.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                        {status.message}
                    </div>
                )}
            </form>

            {previewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-lg flex flex-col shadow-xl">
                        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-600">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Aperçu de la newsletter
                            </h3>
                            <button
                                className="btn btn-ghost btn-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setPreviewOpen(false)}
                            >
                                Fermer
                            </button>
                        </div>
                        <div className="p-6 overflow-auto flex-1">
                            <div className="border border-gray-300 dark:border-gray-600 p-4 rounded bg-white dark:bg-gray-700">
                                <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                                    {subject || '(Sans sujet)'}
                                </h4>
                                <div
                                    className="prose max-w-none dark:prose-invert text-gray-900 dark:text-gray-100"
                                    dangerouslySetInnerHTML={{
                                        __html: message || '<p class="text-gray-500 dark:text-gray-400">(Aucun contenu)</p>'
                                    }}
                                />
                                {message && (
                                    <div
                                        className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: defaultSignature
                                        }}
                                    />
                                )}
                            </div>
                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                <p>Cet aperçu montre le rendu final tel qu'il apparaîtra dans les e-mails.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .ck-editor-dark :global(.ck.ck-editor__editable:not(.ck-editor__nested-editable)) {
                    background: var(--ck-color-base-background, white);
                    color: var(--ck-color-base-text, black);
                }

                .dark .ck-editor-dark :global(.ck.ck-editor__editable:not(.ck-editor__nested-editable)) {
                    background: #1f2937;
                    color: #f9fafb;
                }

                .dark .ck-editor-dark :global(.ck.ck-toolbar) {
                    background: #374151;
                    border-color: #4b5563;
                }

                .dark .ck-editor-dark :global(.ck.ck-button) {
                    color: #f9fafb;
                }

                .dark .ck-editor-dark :global(.ck.ck-button:not(.ck-disabled):hover) {
                    background: #4b5563;
                }

                .dark .ck-editor-dark :global(.ck.ck-dropdown__panel) {
                    background: #374151;
                    border-color: #4b5563;
                }
            `}</style>
        </div>
    );
}

export default AdminNewsletterPage;