import { proxy } from 'umi';

const state = proxy({
  userInfo: {
    name: 'sorrycc',
    mail: 'sorrycc@gmail.com',
  } as Record<string, string> | null,
  actions: {
    logout() {
      state.userInfo = null;
    },
  },
});

export default state;
