import React, {useEffect, useRef} from 'react';
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/lib/codemirror.css"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import Codemirror from 'codemirror';
import ACTIONS from '../Actions';


// import { javascript } from '@codemirror/lang-javascript';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(()=>{
        async function init() {
        editorRef.current=Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: {name: "javascript", json: true},
                lineNumbers: true,
                theme:'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
            }
        );
        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });
        }
        init();
    },[]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);


    return (
            <textarea id='realtimeEditor'></textarea>
       
    )
}

export default Editor;
