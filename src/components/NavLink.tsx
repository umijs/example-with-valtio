import { NavLink as NativeNavLink } from 'umi';
import React, { PropsWithChildren } from 'react';

export const NavLink: React.FC<
  PropsWithChildren<{
    to: string;
    activeClassName: string;
  }>
> = (props) => {
  return (
    <NativeNavLink
      className={({ isActive }) => (isActive ? props.activeClassName : '')}
      to={props.to}
    >
      {props.children}
    </NativeNavLink>
  );
};
