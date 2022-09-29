import { useSnapshot } from 'umi';
// @ts-ignore
import MarkdownIt from 'markdown-it';
import { store } from './store';

const md = new MarkdownIt({
  linkify: true,
});

export const Preview: React.FC = () => {
  const { currentFile, files } = useSnapshot(store);
  const file = currentFile && files.get(currentFile);

  if (!file) return <div>FILE NOT OPEN</div>;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: md.render(file.content),
      }}
    />
  );
};
