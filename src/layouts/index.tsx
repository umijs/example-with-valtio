import { Outlet, useSnapshot, Link } from 'umi';
import globalStore from '@/stores/global';
import styles from './index.less';
import { NavLink } from '@/components/NavLink';

export default function Layout() {
  const { userInfo } = useSnapshot(globalStore);
  if (userInfo) {
    return (
      <div>
        <div>
          hi {userInfo.name},{' '}
          <button onClick={() => globalStore.actions.logout()}>logout</button>
        </div>
        <div className={styles.nav}>
          <span>
            <NavLink to="/todos" activeClassName={styles.activeNav}>
              Todos
            </NavLink>
          </span>
          <span>
            <NavLink to="/hackernews" activeClassName={styles.activeNav}>
              Hackernews
            </NavLink>
          </span>
          <span>
            <NavLink to="/editor" activeClassName={styles.activeNav}>
              Editor
            </NavLink>
          </span>
        </div>
        <hr />
        <Outlet />
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            globalStore.userInfo = {
              name: 'foo',
              mail: 'foo@gmail.com',
            };
          }}
        >
          Login
        </button>
      </div>
    );
  }
}
