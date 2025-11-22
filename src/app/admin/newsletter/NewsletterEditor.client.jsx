"use client";

import {useRef} from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import 'ckeditor5/ckeditor5.css';
import {Bold, ClassicEditor, Essentials, Heading, Italic, Link, List, Paragraph} from "ckeditor5";

export default function NewsletterEditor({
                                             data, config = {
        licenseKey: 'GPL',
        plugins: [Essentials, Paragraph, Bold, Italic, Heading, List, Link],
        toolbar: {
            items: [
                'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'link', '|', 'undo', 'redo'
            ]
        },
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraphe', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Titre 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Titre 2', class: 'ck-heading_heading2'},
                {model: 'heading3', view: 'h3', title: 'Titre 3', class: 'ck-heading_heading3'}
            ]
        },
        placeholder: 'Rédigez votre newsletter ici...',
        initialData: '<p>Bienvenue dans l\'éditeur de newsletter !</p>'
    }, onChange, onReady
                                         }) {
    const editorRef = useRef();

    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={config}
            onReady={(editor) => {
                editorRef.current = editor;
                if (typeof onReady === "function") onReady(editor);
            }}
            onChange={(event, editor) => {
                if (typeof onChange === "function") onChange(event, editor);
            }}
        />
    );
}