import React, { useRef, useEffect, useState } from 'react';

import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';

import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';


const languages = [
    { key: "None", value: indentUnit.of("  ") },
    { key: "Python", value: python() },
    { key: "Java", value: java() },
    { key: "Javascript", value: javascript() },
    { key: "C++", value: cpp() },
    { key: "Rust", value: rust() },
]


// https://codemirror.net/examples/collab/
export const Editor = (props) => {
    const editor = useRef();
    // TODO: remove onUpdate extension if not used in the future
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(languages[0].value);

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString());
    });

    const editorStyle = EditorView.theme({
        "&": { height: "70vh", minHeight: "500px" },
        ".cm-scroller": { overflow: "auto" }
    })

    useEffect(() => {
        const state = EditorState.create({
            doc: props.initDoc,
            extensions: [
                basicSetup,
                keymap.of([defaultKeymap, indentWithTab]),
                props.peerExtension(props.initVersion),
                editorStyle,
                language,
                onUpdate,
            ],
        });

        const view = new EditorView({ state, parent: editor.current });

        return () => {
            view.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.peerExtension, props.initDoc, language]);


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                select
                label="language"
            >
                {languages.map(x => <MenuItem key={x.key} value={x.value}>{x.key}</MenuItem>)}
            </TextField>
            <div style={{ backgroundColor: "white", width: "50vw", minWidth: "300px", minHeight: "500px", border: "1px solid black" }} ref={editor} />
        </div>
    );
};


