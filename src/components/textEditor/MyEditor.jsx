import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './MyEditor.css';


const MyEditor = ({ content, setContent, desHeight,className = ''}) => {
  const editorRef = useRef();
  useEffect(() => {
    // Reset content if it is empty
    if (content?.length === 0) {
      setContent("");
    }
  }, [content, setContent]);

  const handleEditorChange = (value) => {
    setContent(value);
  };
  useEffect(() => {
    if (editorRef.current) {
      // Set the minHeight on the .ql-container
      const quillEditor = editorRef.current.getEditor();
      const editorContainer = quillEditor.container.querySelector('.ql-editor');
      if (editorContainer) {
        editorContainer.style.minHeight = desHeight;
        editorContainer.style.overflow = 'auto';
      }
    }
  }, [desHeight]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        [{ align: [] }],
        [
          {
            color: [
              '#000000', // black
              '#FFFFFF', // white
              '#FF0000', // red
              '#A9A9A9', // dark gray
              '#808080', // gray
              '#0000FF', // blue
              '#FFFF00', // yellow
              '#008000', // green
              '#FFA500', // orange
              '#800080', // purple
              '#00FFFF', // cyan
              '#3A3A3A',//dark gray
            ],
          },
        ],
        ['clean'],
      ],
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        ref={editorRef}
        className={className}
        modules={modules}
        value={content}
        onChange={handleEditorChange}
        placeholder='Start typing here....'

      />
    </div>
  );
};

export default MyEditor;
