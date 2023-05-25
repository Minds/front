import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, take } from 'rxjs';
import { MarkdownModule } from 'ngx-markdown';
import { AuxComponent } from './aux-pages.component';
import { AuxPagesService } from './aux-pages.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../services/session';
import { MockComponent, MockService } from '../../utils/mock';
import {
  StrapiMetaService,
  StrapiMetadata,
} from '../../common/services/strapi/strapi-meta.service';

describe('AuxComponent', () => {
  let comp: AuxComponent;
  let fixture: ComponentFixture<AuxComponent>;

  const mockMetadata: StrapiMetadata = {
    title: 'ogTitle',
    description: 'ogDescription',
    canonicalUrl: 'https://0.0.0.0/canonicalUrl',
    robots: 'all',
    author: 'Minds',
    ogAuthor: 'ogMinds',
    ogUrl: 'https://0.0.0.0/ogUrl',
    ogType: 'ogType',
    ogImage: {
      data: {
        attributes: {
          url: 'ogImage.png',
          height: 1200,
          width: 1200,
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot()],
      declarations: [
        AuxComponent,
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-marketing',
          inputs: ['useFullWidth'],
        }),
      ],
      providers: [
        {
          provide: AuxPagesService,
          useValue: MockService(AuxPagesService, {
            has: [
              'path$',
              'headerCopy$',
              'bodyCopy$',
              'updatedAtDateString$',
              'metadata$',
              'notFound$',
              'loading$',
            ],
            props: {
              path$: { get: () => new BehaviorSubject<string>('privacy') },
              headerCopy$: {
                get: () => new BehaviorSubject<string>('headerText'),
              },
              bodyCopy$: { get: () => new BehaviorSubject<string>('bodyText') },
              updatedAtDateString$: {
                get: () => new BehaviorSubject<string>('Jan 1st 1970'),
              },
              metadata$: {
                get: () => new BehaviorSubject<StrapiMetadata>(mockMetadata),
              },
              notFound$: { get: () => new BehaviorSubject<boolean>(false) },
              loading$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: { params: new BehaviorSubject<any>({ path: 'privacy' }) },
        },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: StrapiMetaService,
          useValue: MockService(StrapiMetaService),
        },
        { provide: Session, useValue: MockService(Session) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuxComponent);
    comp = fixture.componentInstance;

    (comp as any).strapiMeta.apply.calls.reset();

    (comp as any).service.headerCopy$.next('headerText');
    (comp as any).service.bodyCopy$.next('bodyText');
    (comp as any).service.updatedAtDateString$.next('Jan 1st 1970');
    (comp as any).service.metadata$.next(mockMetadata);
    (comp as any).service.notFound$.next(false);
    (comp as any).service.loading$.next(false);

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should init with route param', () => {
    (comp as any).service.path$.next('privacy');
    (comp as any).service.notFound$.next(false);
    (comp as any).service.metadata$.next(mockMetadata);

    (comp as any).route.params.next({ path: 'terms' });

    expect((comp as any).service.path$.getValue()).toBe('terms');
    expect((comp as any).strapiMeta.apply).toHaveBeenCalledWith(mockMetadata);
  });

  it('should get header copy from service', (done: DoneFn) => {
    const text: string = 'headerText';
    (comp as any).service.headerCopy$.next(text);

    (comp as any).service.headerCopy$
      .pipe(take(1))
      .subscribe((headerText: string) => {
        expect(headerText).toBe(text);
        done();
      });
  });

  it('should get body copy from service', (done: DoneFn) => {
    const text: string = 'bodyText';
    (comp as any).service.bodyCopy$.next(text);

    (comp as any).service.bodyCopy$
      .pipe(take(1))
      .subscribe((bodyText: string) => {
        expect(bodyText).toBe(text);
        done();
      });
  });

  it('should get updatedAtDateString copy from service', (done: DoneFn) => {
    const text: string = 'updatedAtDateString';
    (comp as any).service.updatedAtDateString$.next(text);

    (comp as any).service.updatedAtDateString$
      .pipe(take(1))
      .subscribe((updatedAtDateString: string) => {
        expect(updatedAtDateString).toBe(text);
        done();
      });
  });

  it('should get loading state from service', (done: DoneFn) => {
    const loadingState: boolean = true;
    (comp as any).service.loading$.next(loadingState);

    (comp as any).service.loading$
      .pipe(take(1))
      .subscribe((loading: boolean) => {
        expect(loading).toBeTrue();
        done();
      });
  });

  it('should call router navigate when not found', () => {
    (comp as any).service.notFound$.next(true);
    expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
      '/p/privacy',
    ]);
  });
});
