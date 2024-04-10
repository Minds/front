import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../../../utils/mock';
import { ProductPageBasicExplainerComponent } from './basic-explainer.component';
import {
  ComponentCommonActionButton,
  Enum_Componentcommonactionbutton_Action,
} from '../../../../../../graphql/generated.strapi';
import { By } from '@angular/platform-browser';

describe('ProductPageBasicExplainerComponent', () => {
  let comp: ProductPageBasicExplainerComponent;
  let fixture: ComponentFixture<ProductPageBasicExplainerComponent>;

  const mockTitle: string = 'Title';
  const mockBody: string = 'Body';
  const mockButton: ComponentCommonActionButton = {
    id: '0',
    __typename: 'ComponentCommonActionButton',
    action: Enum_Componentcommonactionbutton_Action.ScrollToTop,
    dataRef: 'dataRef',
    navigationUrl: '',
    solid: true,
    text: 'text',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductPageBasicExplainerComponent,
        MockComponent({
          selector: 'm-productPage__button',
          inputs: ['data'],
        }),
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ProductPageBasicExplainerComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'title', { writable: true });
    Object.defineProperty(comp, 'body', { writable: true });
    Object.defineProperty(comp, 'button', { writable: true });

    (comp as any).title = mockTitle;
    (comp as any).body = mockBody;
    (comp as any).button = mockButton;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('.m-productBasicExplainer__title'))
    ).toBeTruthy();

    expect(fixture.debugElement.query(By.css('markdown'))).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__button'))
    ).toBeTruthy();
  });
});
