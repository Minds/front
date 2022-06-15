import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import exp = require('constants');
import { sampleUsers } from '../../../../tests/samples/sample-users';
import { siteServiceMock } from '../../../modules/notifications/notification.service.spec';
import { SiteService } from '../../services/site.service';
import { ReadMoreComponent } from './read-more.component';
import { ReadMoreModule } from './read-more.module';

describe('ReadMoreComponent', () => {
  let comp: ReadMoreComponent;
  let fixture: ComponentFixture<ReadMoreComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, ReadMoreModule],
        declarations: [ReadMoreComponent],
        providers: [
          {
            provide: SiteService,
            useValue: siteServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreComponent);
    comp = fixture.componentInstance;

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
});
