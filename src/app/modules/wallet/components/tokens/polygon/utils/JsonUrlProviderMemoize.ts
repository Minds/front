import { ethers } from 'ethers';
import memoize from 'lodash.memoize';

export class JsonRpcProviderMemoize extends ethers.providers.JsonRpcProvider {
  send = memoize(
    (method: string, params: Array<any>): Promise<any> => {
      return super.send(method, params);
    },
    (method, params) => {
      // 5s threshold
      const threshold = Math.floor(Date.now() / 5000);
      const hash = JSON.stringify([method, params]);
      return `${threshold}_${hash}`;
    }
  );
}
