import React from 'react';
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
      <div
        className={clsx({
          [styles.active]: isActive,
        })}
      >
        {file.name}
      </div>
    </div>
  );
};

export const FileList: React.FC = () => {
  const { files, currentFile } = useSnapshot(store);
  const filesObj = Object.fromEntries(files);
  return (
    <div>
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
