import { TestBed } from '@angular/core/testing';
import { EntitiesService } from './entities.service';
import { BlockListService } from './block-list.service';
import { Client } from '../api/client.service';
import { MockService } from '../../utils/mock';

describe('EntitiesService', () => {
  let service: EntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntitiesService,
        { provide: Client, useValue: MockService(Client) },
        { provide: BlockListService, useValue: MockService(BlockListService) },
      ],
    });

    service = TestBed.inject(EntitiesService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch()', () => {
    it('should fetch entities and add them to map', async () => {
      (service as any).client.get.and.returnValue({
        entities: [
          { urn: 'urn:1', data: 'test1' },
          { urn: 'urn:2', data: 'test2' },
        ],
      });

      await service.fetch(['urn:1', 'urn:2']);

      expect((service as any).entities.get('urn:1')).toBeTruthy();
      expect((service as any).entities.get('urn:2')).toBeTruthy();
    });

    it('should handle not found entities', async () => {
      (service as any).client.get.and.returnValue({ entities: [] });

      await service.fetch(['urn:notfound']);

      expect((service as any).entities.get('urn:notfound')).toBeTruthy();
      expect((service as any).entities.get('urn:notfound').error).toBeTruthy();
    });

    it('should set error when response requires login', async () => {
      (service as any).client.get.and.returnValue({
        entities: [],
        require_login: true,
      });

      await service.fetch(['urn:1']);

      expect((service as any).entities.get('urn:1').error).toBeTruthy();
    });
  });
});
