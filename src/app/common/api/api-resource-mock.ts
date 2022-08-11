import { StorageV2 } from '../../services/storage/v2';
import { MockService } from '../../utils/mock';
import { QueryRef } from './api-resource.service';
import { ApiRequestMethod, ApiService } from './api.service';

export let experimentsServiceMock = new (function() {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

const apiResourceMock = {
  query: () =>
    // @ts-ignore
    new QueryRef(MockService(ApiService), new StorageV2(), experimentsServiceMock, {
      method: ApiRequestMethod.GET,
    }),
};

export default apiResourceMock;
