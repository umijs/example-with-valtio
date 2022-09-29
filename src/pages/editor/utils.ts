export function addSelectorPrefix(css: string, selectorPrefix: string) {
  // hack
  if (css.includes('.markdown-body')) {
    return css.replace(/\.markdown-body/g, selectorPrefix);
  }

  return css
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return line;
      if (line.startsWith('#preview')) return line;
      if (line.includes('{') || line.endsWith(',')) {
        return selectorPrefix + ' ' + line;
      }
      return line;
    })
    .join('\n');
}
