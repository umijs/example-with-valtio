import React from 'react';
import { FileList } from './FileList';
import { Editor } from './Editor';
import { Preview } from './Preview';
import styles from './index.less';
import { ThemeSelector } from './ThemeSelector';

const EditorApp: React.FC = () => {
  return (
    <div className={styles.normal}>
      <div className={styles.side}>
        <FileList />
        <ThemeSelector />
      </div>
      <div className={styles.editor}>
        <Editor />
      </div>
      <div className={styles.preview}>
        <Preview />
      </div>
    </div>
  );
};

export default EditorApp;
