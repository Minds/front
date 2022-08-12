import { apiServiceMock } from '../../mocks/services/api-mock.spec';
import { StorageV2 } from '../../services/storage/v2';
import { QueryRef } from './api-resource.service';
import { ApiRequestMethod } from './api.service';

export let experimentsServiceMock = new (function() {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

const apiResourceMock = {
  query: () =>
    new QueryRef(apiServiceMock, new StorageV2(), experimentsServiceMock, '', {
      method: ApiRequestMethod.GET,
    }),
};

export default apiResourceMock;
