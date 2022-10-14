import React, { useRef, useEffect, useState } from 'react';

import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

// https://codemirror.net/examples/collab/
export const Editor = (props) => {
    const editor = useRef();
    // TODO: remove onUpdate extension if not used in the future
    const [code, setCode] = useState('');

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString());
    });

    const fixedHeightEditor = EditorView.theme({
        "&": { height: "40vh" },
        ".cm-scroller": { overflow: "auto" }
    })

    useEffect(() => {
        const state = EditorState.create({
            doc: props.initDoc,
            extensions: [
                basicSetup,
                keymap.of([defaultKeymap, indentWithTab]),
                props.peerExtension(props.initVersion),
                fixedHeightEditor,
                indentUnit.of("    "),
                onUpdate,
            ],
        });

        const view = new EditorView({ state, parent: editor.current });

        return () => {
            view.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.peerExtension, props.initDoc]);

    return <div style={{ border: '1px solid black', minHeight: "40vh", maxHeight: "40vh" }} ref={editor} />;
};


