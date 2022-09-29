import { proxyMap, proxyWithComputed } from 'umi';
import {
  fetchIdsByType,
  fetchItems,
  fetchUser,
} from '@/pages/hackernews/service';
import { proxyWithSubscriptions } from '@/libs/proxyWithSubscriptions';
import { navs } from '@/pages/hackernews/constants';

export interface Item {
  id: number;
  by: string;
  descendants: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}
export interface Comment {
  id: number;
  by: string;
  parent: number;
  text: string;
  time: number;
  type: 'comment';
}
export interface User {
  id: string;
  karma: number;
  created: number;
  about: string;
  submitted: number[];
}
export type Type = 'top' | 'new' | 'show' | 'ask' | 'job';

export const store = proxyWithSubscriptions(
  proxyWithComputed(
    {
      activeType: 'top' as Type,
      itemsPerPage: 20,
      currentPage: 1,
      lists: {
        top: [],
        new: [],
        show: [],
        ask: [],
        job: [],
      } as Record<Type, number[]>,
      currentPageIds: [] as number[],
      items: proxyMap<number, Item>(),
      comments: proxyMap<number, Comment>(),
      users: proxyMap<string, Omit<User, 'submitted'>>(),
      actions: {
        async fetchList(payload?: { page?: number }) {
          if (payload?.page) store.currentPage = payload?.page;
          const page = payload?.page || store.currentPage;
          if (store.lists[store.activeType].length) {
            const ids = store.lists[store.activeType];
            const currentPageIds = ids.slice(
              store.itemsPerPage * (page - 1),
              store.itemsPerPage * page,
            );
            store.currentPageIds = currentPageIds;
          }
          const ids = await fetchIdsByType(store.activeType);
          store.lists[store.activeType] = ids;
          const currentPageIds = ids.slice(
            store.itemsPerPage * (page - 1),
            store.itemsPerPage * page,
          );
          store.currentPageIds = currentPageIds;
          const items = await fetchItems(currentPageIds);
          items.forEach((item) => {
            store.items.set(item.id, item);
          });
        },
        async fetchItem(payload: { id: number }) {
          const items = await fetchItems([payload.id]);
          items.forEach((item) => {
            store.items.set(item.id, item);
          });
          const comments = (await fetchItems(
            store.items.get(payload.id)?.kids || [],
          )) as Comment[];
          comments.forEach((item) => {
            store.comments.set(item.id, item);
          });
        },
        async fetchUser(payload: { id: string }) {
          const user = (await fetchUser(payload.id)) as User;
          store.users.set(payload.id, {
            id: user.id,
            karma: user.karma,
            about: user.about,
            created: user.created,
          });
        },
      },
    },
    {
      totalPage: (snap) => {
        return (
          Math.floor(snap.lists[snap.activeType].length / snap.itemsPerPage) + 1
        );
      },
    },
  ),
  {
    subscriptions: {
      setup({ history, pathToRegexp }) {
        const navKeys = Object.keys(navs);
        return history.listen((args: any) => {
          const listMatch = pathToRegexp('/hackernews/:type/:page').exec(
            args.location.pathname,
          );
          if (listMatch && listMatch[1] && navKeys.includes(listMatch[1])) {
            store.activeType = listMatch[1] as Type;
            store.actions.fetchList({
              page: listMatch[2] ? parseInt(listMatch[2], 10) : 1,
            });
          }
          const itemMatch = pathToRegexp('/hackernews/item/:id').exec(
            args.location.pathname,
          );
          if (itemMatch) {
            store.actions.fetchItem({
              id: itemMatch[1] ? parseInt(itemMatch[1], 10) : 1,
            });
          }
          const userMatch = pathToRegexp('/hackernews/user/:id').exec(
            args.location.pathname,
          );
          if (userMatch) {
            store.actions.fetchUser({
              id: userMatch[1],
            });
          }
        });
      },
    },
  },
);
