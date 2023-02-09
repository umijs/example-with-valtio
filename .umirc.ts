export default {
  // mfsu: { strategy: 'eager' },
  routes: [
    { path: '/', component: 'index' },
    { path: '/todos', component: 'todos' },
    {
      path: '/hackernews',
      component: 'hackernews',
      routes: [
        { path: '', redirect: 'top' },
        { path: 'item/:itemId', component: 'hackernews/item' },
        { path: 'user/:userId', component: 'hackernews/user' },
        { path: ':type/', redirect: './1' },
        { path: ':type/:pageId', component: 'hackernews/list' },
      ],
    },
    { path: '/editor', component: 'editor' },
  ],
  plugins: ['@umijs/plugins/dist/valtio'],
  valtio: {},
};
