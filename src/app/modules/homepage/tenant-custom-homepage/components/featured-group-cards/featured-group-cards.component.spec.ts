import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantFeaturedGroupCardsComponent } from './featured-group-cards.component';
import { MockComponent } from '../../../../../utils/mock';
import { GetFeaturedEntitiesGQL } from '../../../../../../graphql/generated.engine';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { TruncatePipe } from '../../../../../common/pipes/truncate.pipe';
import { By } from '@angular/platform-browser';

describe('TenantFeaturedGroupCardsComponent', () => {
  let comp: TenantFeaturedGroupCardsComponent;
  let fixture: ComponentFixture<TenantFeaturedGroupCardsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        TenantFeaturedGroupCardsComponent,
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
        TruncatePipe,
      ],
      providers: [
        {
          provide: GetFeaturedEntitiesGQL,
          useValue: {
            fetch: jasmine.createSpy('fetch').and.returnValue(
              of({
                data: {
                  featuredEntities: {
                    edges: [
                      {
                        node: {
                          id: '1',
                          name: 'Group 1',
                          entityGuid: '123',
                          briefDescription: 'description1',
                        },
                      },
                      {
                        node: {
                          id: '2',
                          name: 'Group 2',
                          entityGuid: '223',
                          briefDescription: 'description2',
                        },
                      },
                      {
                        node: {
                          id: '3',
                          name: 'Group 3',
                          entityGuid: '323',
                          briefDescription: 'description3',
                        },
                      },
                    ],
                  },
                },
              })
            ),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TenantFeaturedGroupCardsComponent);
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should get featuredEntities', (done: DoneFn) => {
    (comp as any).featuredGroups$.subscribe((featuredGroups) => {
      expect(featuredGroups).toEqual([
        {
          id: '1',
          name: 'Group 1',
          entityGuid: '123',
          briefDescription: 'description1',
        },
        {
          id: '2',
          name: 'Group 2',
          entityGuid: '223',
          briefDescription: 'description2',
        },
        {
          id: '3',
          name: 'Group 3',
          entityGuid: '323',
          briefDescription: 'description3',
        },
      ]);
      done();
    });
  });

  it('should render featured entities', () => {
    expect(
      fixture.nativeElement.querySelectorAll('.m-tenantFeaturedGroupCard')
        .length
    ).toBe(3);

    const avatars: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-tenantFeaturedGroupCard minds-avatar')
    );
    expect(avatars.length).toBe(3);
    expect(avatars[0]).toBeTruthy();
    expect(avatars[1]).toBeTruthy();
    expect(avatars[2]).toBeTruthy();

    const names: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-tenantFeaturedGroupCard .m-tenantFeaturedGroupCard__name')
    );
    expect(names.length).toBe(3);
    expect(names[0].nativeElement.innerText).toBe('Group 1');
    expect(names[1].nativeElement.innerText).toBe('Group 2');
    expect(names[2].nativeElement.innerText).toBe('Group 3');

    const descriptions: DebugElement[] = fixture.debugElement.queryAll(
      By.css(
        '.m-tenantFeaturedGroupCard .m-tenantFeaturedGroupCard__description'
      )
    );
    expect(descriptions.length).toBe(3);
    expect(descriptions[0].nativeElement.innerText).toBe('description1');
    expect(descriptions[1].nativeElement.innerText).toBe('description2');
    expect(descriptions[2].nativeElement.innerText).toBe('description3');
  });

  it('should render nothing when no groups are found', () => {
    (comp as any).featuredGroups$ = of([]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.m-tenantFeaturedGroupCard')
        .length
    ).toBe(0);
  });
});
