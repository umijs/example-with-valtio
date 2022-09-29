import { useEffect } from 'react';
import { useParams, useSnapshot } from 'umi';
import { store } from '@/pages/hackernews/store';
import { htmlDecode, timeAgo } from '@/pages/hackernews/utils';

export default function HackerNewsUser() {
  const params = useParams();
  const userId = params.userId!;
  // useEffect(() => {
  //   (async () => {
  //     await store.actions.fetchUser({
  //       id: userId,
  //     });
  //   })();
  // }, [userId]);
  const { users } = useSnapshot(store);
  const user = users.get(userId);
  if (!user) {
    return null;
  }
  return (
    <div>
      <div>user: {userId}</div>
      <div>created at {timeAgo(user.created)}</div>
      <div>{htmlDecode(user.about)}</div>
    </div>
  );
}
