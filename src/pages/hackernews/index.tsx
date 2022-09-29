import { Link, Outlet, useSnapshot } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { NavLink } from '@/components/NavLink';
import { navs } from '@/pages/hackernews/constants';

function StyledNavLink(props: any) {
  return (
    <span className={styles.navItem}>
      <NavLink activeClassName={styles.activeNav} to={props.to}>
        {props.children}
      </NavLink>
    </span>
  );
}

export default function HackerNews() {
  return (
    <div>
      <div>
        {Object.keys(navs).map((key) => (
          <StyledNavLink to={key} key={key}>
            {navs[key]}
          </StyledNavLink>
        ))}
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
