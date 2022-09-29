import MonacoEditor from '@monaco-editor/react';
import { useSnapshot } from 'umi';
import { store } from './store';

export const Editor: React.FC = () => {
  const { currentFile, files } = useSnapshot(store);
  const file = currentFile && files.get(currentFile);

  if (!file) return <div>FILE NOT OPEN</div>;

  return (
    <div>
      <MonacoEditor
        height="70vh"
        language="markdown"
        theme="vs-dark"
        value={file.content}
        key={currentFile}
        onChange={(value, ev) => {
          if (value) store.actions.updateFile(currentFile, value);
        }}
      />
    </div>
  );
};
