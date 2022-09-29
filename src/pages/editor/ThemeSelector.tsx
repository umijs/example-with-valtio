import React, { useEffect, useRef } from 'react';
import { useSnapshot } from 'umi';
import { store } from './store';
import styles from './ThemeSelector.less';
import clsx from 'clsx';
import { themes as themesObj } from './constants';
import { addSelectorPrefix } from '@/pages/editor/utils';

const ThemeItem: React.FC<{ theme: string }> = ({ theme }) => {
  const { currentTheme } = useSnapshot(store);
  return (
    <div
      className={clsx(
        currentTheme === theme && styles.activeTheme,
        styles.themeItem,
      )}
      onClick={() => {
        store.actions.changeTheme(theme);
      }}
    >
      {theme}
    </div>
  );
};

export const ThemeSelector: React.FC = () => {
  const { themes, currentTheme } = useSnapshot(store);
  const styleEl = useRef<HTMLStyleElement>();
  if (!styleEl.current) {
    styleEl.current = document.createElement('style');
    document.head.appendChild(styleEl.current);
  }
  useEffect(() => {
    const css = themesObj[currentTheme].style;
    styleEl.current!.innerHTML = addSelectorPrefix(css, '#preview');
  }, [currentTheme]);
  return (
    <div>
      <div className={styles.title}>Themes</div>
      <div>
        {themes.map((theme: string) => {
          return <ThemeItem key={theme} theme={theme} />;
        })}
      </div>
    </div>
  );
};
