import React, { useState } from 'react';
import { File, store } from '@/pages/editor/store';
import { useSnapshot } from 'umi';
import styles from './FileList.less';
import clsx from 'clsx';

const FileItem: React.FC<{ file: File; isActive: boolean }> = ({
  file,
  isActive,
}) => {
  return (
    <div
      onClick={() => {
        store.actions.openFile(file.name);
      }}
    >
      <div className={clsx(isActive && styles.activeItem, styles.fileItem)}>
        {file.name}
      </div>
    </div>
  );
};

function AddFileInput() {
  const [v, setV] = useState('');
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (v.trim().length > 0) {
      setV('');
      let name = v.trim();
      if (!name.endsWith('.md')) name += '.md';
      store.actions.addFile(name);
    }
  }
  return (
    <div className={styles.addInput}>
      <form onSubmit={handleSubmit}>
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="Add..."
        />
      </form>
    </div>
  );
}

export const FileList: React.FC = () => {
  const { files, currentFile } = useSnapshot(store);
  const filesObj = Object.fromEntries(files);
  return (
    <div>
      <AddFileInput />
      {Object.keys(filesObj).map((key) => {
        const file = files.get(key)!;
        return (
          <FileItem
            key={key}
            file={file}
            isActive={currentFile === file.name}
          />
        );
      })}
    </div>
  );
};
