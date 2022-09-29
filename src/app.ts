import { history } from 'umi';
import { patchHistory } from '@/libs/patchHistory';

export function rootContainer(container: any) {
  patchHistory(history);
  return container;
}
