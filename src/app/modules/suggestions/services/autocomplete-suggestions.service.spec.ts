import { TestBed } from '@angular/core/testing';
import { AutocompleteSuggestionsService } from './autocomplete-suggestions.service';
import { Client } from '../../../services/api';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import userMock from '../../../mocks/responses/user.mock';

describe('AutocompleteSuggestionsService', () => {
  let service: AutocompleteSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutocompleteSuggestionsService,
        { provide: Client, useValue: MockService(Client) },
        { provide: Session, useValue: MockService(Session) },
      ],
    });

    service = TestBed.inject(AutocompleteSuggestionsService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('findSuggestions', () => {
    it('should return user suggestions when user is mature', async () => {
      const searchText: string = userMock.username;
      (service as any).client.get.and.returnValue(
        Promise.resolve({
          entities: [userMock],
        })
      );
      (service as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 1,
      });

      const suggestions = await service.findSuggestions(searchText, '@');

      expect((service as any).client.get).toHaveBeenCalledWith(
        'api/v2/search/suggest',
        {
          q: searchText,
          include_nsfw: 1,
        }
      );
      expect(suggestions).toEqual([userMock]);
    });

    it('should return user suggestions when user is not mature', async () => {
      const searchText: string = userMock.username;
      (service as any).client.get.and.returnValue(
        Promise.resolve({
          entities: [userMock],
        })
      );
      (service as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 0,
      });

      const suggestions = await service.findSuggestions(searchText, '@');

      expect((service as any).client.get).toHaveBeenCalledWith(
        'api/v2/search/suggest',
        {
          q: searchText,
          include_nsfw: 0,
        }
      );
      expect(suggestions).toEqual([userMock]);
    });

    it('should return user suggestions with include_nsfw 0 when user is not logged in', async () => {
      const searchText: string = userMock.username;
      (service as any).client.get.and.returnValue(
        Promise.resolve({
          entities: [userMock],
        })
      );
      (service as any).session.getLoggedInUser.and.returnValue(null);

      const suggestions = await service.findSuggestions(searchText, '@');

      expect((service as any).client.get).toHaveBeenCalledWith(
        'api/v2/search/suggest',
        {
          q: searchText,
          include_nsfw: 0,
        }
      );
      expect(suggestions).toEqual([userMock]);
    });
  });
});
