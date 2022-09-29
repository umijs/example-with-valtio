import React, { useEffect } from 'react';
import { Item, store, Type } from './store';
import { useSnapshot, Link, useParams } from 'umi';
import styles from './list.less';
import { host, timeAgo } from '@/pages/hackernews/utils';

const HackerNewsItem: React.FC<{
  item: Item;
}> = ({ item }) => {
  return (
    <div className={styles.item}>
      {'descendants' in item ? (
        <div className={styles.score}>{item.descendants}</div>
      ) : null}
      <div>
        <div className={styles.title}>
          <a href={item.url} target="_blank">
            {item.title}
          </a>
          {item.url ? <span>({host(item.url)})</span> : null}
        </div>
        <div>
          by <Link to={`/hackernews/user/${item.by}`}>{item.by}</Link>{' '}
          {timeAgo(item.time)} ago{' '}
          <Link to={`/hackernews/item/${item.id}`}>
            {item.kids?.length || '0'} comments
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pager: React.FC<{}> = () => {
  const params = useParams();
  const { currentPage, totalPage } = useSnapshot(store);
  return (
    <div className={styles.pager}>
      {currentPage > 1 ? (
        <>
          <Link to={`../${params.type}/${currentPage - 1}`}>Previous</Link>
          <span> </span>
        </>
      ) : null}
      <span>
        {currentPage}/{totalPage}
      </span>
      {totalPage > currentPage ? (
        <Link to={`../${params.type}/${currentPage + 1}`}>Next</Link>
      ) : null}
    </div>
  );
};

export default function HackerNewsList() {
  // const params = useParams();
  // useEffect(() => {
  //   (async () => {
  //     store.activeType = params.type as Type;
  //     await store.actions.fetchList({
  //       page: params.pageId ? parseInt(params.pageId, 10) : 1,
  //     });
  //   })();
  // }, [params]);

  const { currentPageIds, items } = useSnapshot(store);

  return (
    <div>
      <Pager />
      {currentPageIds.map((id) => {
        const item = items.get(id);
        return item ? <HackerNewsItem key={id} item={item} /> : null;
      })}
    </div>
  );
}
