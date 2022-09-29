export function patchHistory(history: any) {
  const oldHistoryListen = history.listen;
  history.listen = (fn: Function) => {
    setTimeout(() => {
      // @ts-ignore
      fn({
        action: 'PUSH',
        location: history.location,
        isFirstRendering: true,
      });
    }, 0);
    return oldHistoryListen.call(history, fn);
  };
}
