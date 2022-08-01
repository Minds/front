import { StorageV2 } from '../../services/storage/v2';
import { MockService } from '../../utils/mock';
import { QueryRef } from './api-resource.service';
import { ApiRequestMethod, ApiService } from './api.service';

const apiResourceMock = {
  query: () =>
    // @ts-ignore
    new QueryRef(MockService(ApiService), MockService(StorageV2), null, {
      method: ApiRequestMethod.GET,
    }),
};

export default apiResourceMock;
