import MonacoEditor, { loader } from '@monaco-editor/react';
import { useSnapshot } from 'umi';
import { store } from './store';

loader.config({
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn',
    },
  },
  paths: {
    vs: 'https://gw.alipayobjects.com/os/lib/monaco-editor/0.33.0/min/vs',
  },
});

export const Editor: React.FC = () => {
  const { currentFile, files } = useSnapshot(store);
  const file = currentFile && files.get(currentFile);

  if (!file) return <div>FILE NOT OPEN</div>;

  // options ref:
  // https://unpkg.com/browse/monaco-editor@0.34.0/esm/vs/editor/editor.api.d.ts
  return (
    <div>
      <MonacoEditor
        height="88vh"
        language="markdown"
        theme="vs-dark"
        value={file.content}
        path={currentFile}
        options={{
          wordWrap: 'on',
        }}
        onChange={(value, ev) => {
          if (value) store.actions.updateFile(currentFile, value);
        }}
      />
    </div>
  );
};
