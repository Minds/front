import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ActivityService } from '../../../modules/newsfeed/activity/activity.service';
import { MockService } from '../../../utils/mock';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import { ClientMetaService } from '../../services/client-meta.service';
import { SiteService } from '../../services/site.service';
import { ReadMoreComponent } from './read-more.component';
import { ReadMoreModule } from './read-more.module';
import { siteServiceMock } from '../../../mocks/services/site-service-mock.spec';

describe('ReadMoreComponent', () => {
  let comp: ReadMoreComponent;
  let fixture: ComponentFixture<ReadMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReadMoreModule],
      declarations: [ReadMoreComponent],
      providers: [
        {
          provide: SiteService,
          useValue: siteServiceMock,
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['entity$'],
            props: {
              entity$: {
                get: () => new BehaviorSubject(null),
              },
            },
          }),
        },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreComponent);
    comp = fixture.componentInstance;

    (comp as any).activityService.entity$.next(null);

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should truncate long text', () => {
    comp.text = `Bacon ipsum dolor amet landjaeger meatloaf biltong alcatra ground round, ball tip hamburger bresaola salami short loin. T-bone flank cupim, pork belly spare ribs frankfurter jowl alcatra tongue pork chop brisket cow. Cow leberkas shank, chicken pancetta short ribs frankfurter. Tenderloin fatback kevin boudin pork belly, andouille doner turducken sirloin porchetta ground round swine short loin beef. Salami shankle short loin andouille pork chop strip steak tail.

    Strip steak kielbasa ground round, ribeye rump short loin capicola andouille swine venison tongue kevin brisket tri-tip leberkas. Ball tip landjaeger pork chop shank cupim, beef ribs short loin frankfurter turkey tongue boudin swine venison. Meatloaf brisket fatback prosciutto andouille capicola chicken tri-tip sirloin shankle. Bresaola alcatra beef ribs pork belly, rump hamburger meatloaf drumstick cupim. Doner frankfurter spare ribs, brisket ball tip boudin pastrami ham hock.
    
    T-bone venison hamburger porchetta spare ribs ribeye tenderloin. Turducken corned beef ribeye strip steak shoulder meatloaf flank brisket fatback. Corned beef pig turkey pork chop, chuck rump swine venison pork belly t-bone shankle turducken shank. Chicken pork belly ham hock porchetta corned beef filet mignon meatball capicola bacon spare ribs.
    
    Tenderloin boudin turducken sausage ribeye brisket pork chop porchetta beef ribs alcatra cow ball tip. Swine ham hock drumstick bacon ball tip leberkas doner strip steak. Doner turducken cow fatback spare ribs leberkas pork chop tenderloin strip steak. Picanha tail pig turducken.
    
    Chuck ground round shankle, filet mignon tri-tip short ribs tail kevin pork loin shoulder cow kielbasa. Sausage t-bone ball tip pork belly prosciutto short loin meatball kevin drumstick rump flank alcatra. Flank venison ham hock short ribs, tail kevin drumstick beef. Short loin pastrami chuck cupim pig, leberkas shank pork belly t-bone picanha landjaeger. Boudin ribeye fatback ham cow sirloin tri-tip spare ribs frankfurter prosciutto, shankle turducken kevin cupim. Andouille pancetta pork, pig capicola kevin fatback hamburger turducken. Flank shank sirloin, jerky cow t-bone ham meatball pancetta ground round tenderloin frankfurter.`;
    expect(comp.outputText).toBe(
      'Bacon ipsum dolor amet landjaeger meatloaf biltong alcatra ground round, ball tip hamburger bresaola salami short loin. T-bone flank cupim, pork belly spare ribs frankfurter jowl alcatra tongue pork chop brisket cow. Cow leberkas shank, chicken pancetta short ribs frankfurter....'
    );
  });

  it('should not truncate short text', () => {
    comp.text = 'Hello world. Do not truncate this';
    expect(comp.outputText).toBe(comp.text);
  });

  it('should truncate long word', () => {
    comp.text =
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    comp.targetLength = 1;

    expect(comp.outputText.length).toBeLessThan(1000);
  });

  it('should call to record click on output text click for an anchor tag and record click with boost client meta', fakeAsync(() => {
    const boostedGuid: string = '123';
    const urn: string = 'urn:boost:234';
    const guid: string = '345';

    (comp as any).activityService.entity$.next({
      boosted_guid: boostedGuid,
      urn: urn,
      guid: guid,
    });

    const mockEvent: MouseEvent = {
      type: 'click',
      target: {
        tagName: 'A',
      },
    } as any;

    comp.onOutputTextClick(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta,
      {
        campaign: urn,
      }
    );
  }));

  it('should call to record click on output text click for an anchor tag and record click without boost client meta', fakeAsync(() => {
    const guid: string = '345';

    (comp as any).activityService.entity$.next({
      boosted_guid: null,
      guid: guid,
    });

    const mockEvent: MouseEvent = {
      type: 'click',
      target: {
        tagName: 'A',
      },
    } as any;

    comp.onOutputTextClick(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta,
      {}
    );
  }));
});
