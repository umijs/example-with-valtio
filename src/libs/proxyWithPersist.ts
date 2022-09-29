import { proxy, proxyMap, snapshot, subscribe } from 'umi';

export function proxyWithPersist<V extends Record<string, any>>(
  initialState: V,
  opts: {
    persistKey: string;
  },
) {
  const localItem = localStorage.getItem(opts.persistKey);
  const state = localItem ? restore(JSON.parse(localItem)) : initialState;
  Object.keys(initialState).forEach((key) => {
    if (!(key in state)) {
      state[key] = initialState[key];
    }
  });
  // @ts-ignore
  state.actions = initialState.actions;
  const store = proxy(state);
  subscribe(store, () => {
    localStorage.setItem(opts.persistKey, JSON.stringify(toJSON(store)));
  });
  return store;
}

function restore(data: any) {
  if (data.files) {
    data.files = proxyMap(data.files);
  }
  return data;
}

function toJSON(store: any) {
  const json = snapshot(store);
  const filteredJSON = Object.keys(json).reduce<any>((memo, key) => {
    if (!['actions', 'subscriptions', 'themes'].includes(key)) {
      memo[key] = json[key];
    }
    return memo;
  }, {});
  return normalize(filteredJSON);
}

function normalize(json: any): any {
  if (json.data && typeof json.entries === 'function') {
    return json.data;
  }
  if (Array.isArray(json)) {
    return json.map((item) => normalize(item));
  }
  if (typeof json === 'object') {
    return Object.keys(json).reduce((acc, key) => {
      acc[key] = normalize(json[key]);
      return acc;
    }, {} as any);
  }
  return json;
}
