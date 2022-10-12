import { proxy } from 'umi';

const store = proxy({
  userInfo: {
    name: 'sorrycc',
    mail: 'sorrycc@gmail.com',
  } as Record<string, string> | null,
  actions: {
    logout() {
      store.userInfo = null;
    },
  },
});

export default store;
