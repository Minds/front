import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleExcludedHashtagsListItemComponent } from './excluded-hashtags-list-item.component';
import { RemoveHashtagExclusionGQL } from '../../../../../../../../graphql/generated.engine';
import { MockComponent } from '../../../../../../../utils/mock';
import { of, throwError } from 'rxjs';

describe('NetworkAdminConsoleExcludedHashtagsListItemComponent', () => {
  let comp: NetworkAdminConsoleExcludedHashtagsListItemComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleExcludedHashtagsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleExcludedHashtagsListItemComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'iconOnly'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: RemoveHashtagExclusionGQL,
          useValue: jasmine.createSpyObj<RemoveHashtagExclusionGQL>(['mutate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      NetworkAdminConsoleExcludedHashtagsListItemComponent
    );
    comp = fixture.componentInstance;
    (comp as any).tagEdge = {
      node: { id: '1', tag: 'testTag', createdTimestamp: 1234567890 },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('removeHashtagExclusion', () => {
    it('should remove hashtag exclusion successfully', async () => {
      (comp as any).removeHashtagExclusionGQL.mutate.and.returnValue(
        of({ data: { removeHashtagExclusion: true } })
      );
      const onRemovedSpy = spyOn(comp.onRemoved, 'emit');

      await comp.removeHashtagExclusion('testTag');

      expect(
        (comp as any).removeHashtagExclusionGQL.mutate
      ).toHaveBeenCalledWith({ hashtag: 'testTag' });
      expect(onRemovedSpy).toHaveBeenCalledWith('testTag');
      expect(comp.inProgress$.getValue()).toBe(false);
    });

    it('should handle failed hashtag exclusion removal', async () => {
      (comp as any).removeHashtagExclusionGQL.mutate.and.returnValue(
        of({ data: { removeHashtagExclusion: false } })
      );
      const onRemovedSpy = spyOn(comp.onRemoved, 'emit');
      const consoleErrorSpy = spyOn(console, 'error');

      await comp.removeHashtagExclusion('testTag');

      expect(
        (comp as any).removeHashtagExclusionGQL.mutate
      ).toHaveBeenCalledWith({ hashtag: 'testTag' });
      expect(onRemovedSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(comp.inProgress$.getValue()).toBe(false);
    });

    it('should handle error during hashtag exclusion removal', async () => {
      (comp as any).removeHashtagExclusionGQL.mutate.and.returnValue(
        throwError(() => new Error('Test error'))
      );
      const onRemovedSpy = spyOn(comp.onRemoved, 'emit');
      const consoleErrorSpy = spyOn(console, 'error');

      await comp.removeHashtagExclusion('testTag');

      expect(
        (comp as any).removeHashtagExclusionGQL.mutate
      ).toHaveBeenCalledWith({ hashtag: 'testTag' });
      expect(onRemovedSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(comp.inProgress$.getValue()).toBe(false);
    });
  });
});
