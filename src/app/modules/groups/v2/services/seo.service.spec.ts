import { TestBed } from '@angular/core/testing';
import { CDN_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { MetaService } from '../../../../common/services/meta.service';
import { MockService } from '../../../../utils/mock';
import { GroupSeoService } from './seo.service';
import { MindsGroup } from '../group.model';
import { groupMock } from '../../../../mocks/responses/group.mock';

describe('GroupSeoService', () => {
  let service: GroupSeoService;
  const cdnUrl: string = 'https://example.minds.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupSeoService,
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: CDN_URL, useValue: cdnUrl },
      ],
    });

    service = TestBed.inject(GroupSeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply metadata', () => {
    const group: MindsGroup = groupMock;

    service.set(group);

    expect((service as any).meta.setOgImage).toHaveBeenCalledWith(
      `${cdnUrl}fs/v1/avatars/${group.guid}/large/${group.icontime}`,
      {
        height: 315,
        width: 600,
      }
    );
  });
});
