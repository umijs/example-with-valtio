import {
  proxy,
  proxyMap,
  proxyWithHistory,
  proxyWithDevtools,
  snapshot,
} from 'umi';
import { proxyWithPersist } from '@/libs/proxyWithPersist';

export interface File {
  name: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export const store = proxyWithPersist(
  {
    currentFile: null as string | null,
    files: proxyMap<string, File>([
      [
        'foo.md',
        {
          name: 'foo.md',
          content: '## foo\na',
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ],
      [
        'bar.md',
        {
          name: 'bar.md',
          content: '## bar\nb',
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ],
    ]),
    actions: {
      addFile(name: string) {
        const baseName = name.replace(/\.md$/, '');
        store.files.set(name, {
          name,
          content: `# ${baseName}`,
          created_at: Date.now(),
          updated_at: Date.now(),
        });
        store.currentFile = name;
      },
      removeFile(name: string) {
        store.files.delete(name);
      },
      updateFile(name: string, content: string) {
        const file = store.files.get(name);
        if (file) {
          file.content = content;
          file.updated_at = Date.now();
          console.log('> ', JSON.stringify(store), store);
        }
      },
      openFile(name: string) {
        store.currentFile = name;
      },
    },
  },
  {
    persistKey: 'editor-1',
  },
);

proxyWithDevtools(store, {
  name: 'editor',
  enabled: true,
});

// @ts-ignore
window.g_snapshot = snapshot;
// @ts-ignore
window.g_store = store;

// store.files.get('a')?.value.created_at;
