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

    const editorStyle = EditorView.theme({
        "&": { height: "100%" },
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

    return <div style={{ backgroundColor: "white", width: "60vw", maxHeight:"70vh" }} ref={editor} />;
};


