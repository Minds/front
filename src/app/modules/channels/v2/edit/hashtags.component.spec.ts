import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChannelEditHashtagsComponent } from './hashtags.component';
import { FormsModule } from '@angular/forms';
import { ChannelEditService } from './edit.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';

describe('ChannelEditHashtagsComponent', () => {
  let comp: ChannelEditHashtagsComponent;
  let fixture: ComponentFixture<ChannelEditHashtagsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          ChannelEditHashtagsComponent,
          MockComponent({
            selector: 'm-hashtags__typeaheadInput',
            inputs: ['content', 'disabled', 'maxEntries'],
          }),
        ],
        providers: [
          {
            provide: ChannelEditService,
            useValue: MockService(ChannelEditService, {
              has: ['hashtags$'],
              props: {
                hashtags$: { get: () => new BehaviorSubject<string[]>([]) },
              },
            }),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ChannelEditHashtagsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should determine when hashtag limit is reached', () => {
    comp.service.hashtags$.next(['1', '2', '3', '4', '5']);
    expectAsync(comp.isHashtagLimitReached$.toPromise()).toBeResolvedTo(true);
  });

  it('should determine when hashtag limit not reached', () => {
    comp.service.hashtags$.next([]);
    expectAsync(comp.isHashtagLimitReached$.toPromise()).toBeResolvedTo(false);
  });

  it('should add a new hashtag', () => {
    const hashtag = 'hashtag';
    comp.service.hashtags$.next([]);
    comp.addHashtagIntent(hashtag);
    expect(comp.service.addHashtag).toHaveBeenCalledWith(hashtag);
  });

  it('should not add a hashtag when the limit is reached', () => {
    const hashtag = 'hashtag';
    comp.service.hashtags$.next(['1', '2', '3', '4', '5']);
    comp.addHashtagIntent(hashtag);
    expect(comp.service.addHashtag).not.toHaveBeenCalledWith(hashtag);
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'You can only have a maximum of 5 hashtags.'
    );
  });

  it('should not add a duplicate hashtag', () => {
    const hashtag = 'hashtag';
    comp.service.hashtags$.next(['hashtag']);
    comp.addHashtagIntent(hashtag);
    expect(comp.service.addHashtag).not.toHaveBeenCalledWith(hashtag);
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'You have already added this hashtag.'
    );
  });

  it('should throw a toast error on checking hashtag limit if hashtag limit is reached', () => {
    comp.service.hashtags$.next(['1', '2', '3', '4', '5']);
    comp.checkHashtagLimit();
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'You can only have a maximum of 5 hashtags.'
    );
  });

  xit('should NOT throw a toast error on checking hashtag limit if hashtag limit is NOT reached', () => {
    comp.service.hashtags$.next(['1', '2', '3', '4']);
    comp.checkHashtagLimit();
    expect((comp as any).toast.error).not.toHaveBeenCalled();
  });
});
