import { history, proxy, proxyWithComputed } from 'umi';
import pathToRegexp from 'path-to-regexp';

export function proxyWithSubscriptions<V>(
  val: V,
  opts?: {
    subscriptions?: Record<
      string,
      (args: {
        history: any;
        pathToRegexp: typeof pathToRegexp;
      }) => Function | void
    >;
  },
) {
  if (opts?.subscriptions) {
    Object.keys(opts.subscriptions).forEach((key) => {
      opts.subscriptions![key]({ history, pathToRegexp });
    });
  }
  return val;
}
