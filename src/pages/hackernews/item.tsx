import React, { useEffect } from 'react';
import { Item, store, Comment } from '@/pages/hackernews/store';
import { Link, useParams, useSnapshot } from 'umi';
import { host, htmlDecode, timeAgo } from '@/pages/hackernews/utils';
import styles from './item.less';

export default function HackerNewsItem() {
  const itemId = parseInt(useParams().itemId!, 10);
  // useEffect(() => {
  //   (async () => {
  //     await store.actions.fetchItem({
  //       id: itemId,
  //     });
  //   })();
  // }, [itemId]);
  const { items, comments } = useSnapshot(store);
  const item = items.get(itemId);
  if (!item) return null;
  return (
    <div>
      <div className={styles.title}>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
        {item.url ? <span>({host(item.url)})</span> : null}
      </div>
      <div className={styles.detail}>
        {'descendants' in item ? <span>{item.descendants} </span> : null}
        by <Link to={`/hackernews/user/${item.by}`}>{item.by}</Link>{' '}
        {timeAgo(item.time)} ago{' '}
      </div>
      <div className={styles.comments}>
        <div className={styles.commentsTitle}>
          {item.kids?.length || 0} comments
        </div>
        {(item.kids || []).map((id) => {
          return <HackerNewsComment key={id} comment={comments.get(id)} />;
        })}
      </div>
    </div>
  );
}

const HackerNewsComment: React.FC<{ comment: Comment | undefined }> = ({
  comment,
}) => {
  if (!comment) return null;
  return (
    <div className={styles.comment}>
      <div>
        <Link to={`/hackernews/user/${comment.by}`}>{comment.by}</Link>{' '}
        {timeAgo(comment.time)} ago
      </div>
      <div>{htmlDecode(comment.text)}</div>
    </div>
  );
};
