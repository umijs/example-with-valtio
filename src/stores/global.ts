import { proxy } from 'umi';

const store = proxy({
  userInfo: {
    name: 'sorrycc',
    mail: 'sorryc@gmail.com',
  } as Record<string, string> | null,
  actions: {
    logout() {
      store.userInfo = null;
    },
  },
});

export default store;
