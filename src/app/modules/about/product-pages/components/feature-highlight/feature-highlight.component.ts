import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import {
  ComponentDynamicProductPageActionButton as ActionButton,
  Enum_Componentdynamicproductpagefeaturehighlight_Alignimage as AlignImage,
  Enum_Componentdynamicproductpagefeaturehighlight_Colorscheme as ColorScheme,
  UploadFileEntityResponse,
} from '../../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

/**
 * Product page feature highlight component. Full screen splashes
 * with various configuration options.
 */
@Component({
  selector: 'm-productPage__featureHighlight',
  templateUrl: 'feature-highlight.component.html',
  styleUrls: ['feature-highlight.component.ng.scss'],
})
export class ProductPageFeatureHighlightComponent implements OnInit {
  /** Title to be displayed. */
  @Input() public readonly title: string;

  /** Markdown text body to be displayed. */
  @Input() public readonly body: string;

  /** Action button to be displayed. */
  @Input() public readonly button: ActionButton;

  /**
   * Color scheme of the component - a light color scheme will provide
   * a dark button / text for use if a light background has been selected.
   */
  @Input() public readonly colorScheme: ColorScheme;

  /** Image to be shown on feature highlight card. */
  @Input() public readonly image: UploadFileEntityResponse;

  /** Whether image should be on the left or right side. */
  @Input() public readonly alignImage: AlignImage;

  /** Background colour of component. */
  @HostBinding('style.background-color')
  @Input()
  public readonly backgroundColor: string;

  /** Whether left alignment class should be applied. */
  @HostBinding('class.m-productPageFeatHighlight__host--left')
  public leftAlign: boolean = false;

  /** Whether right alignment class should be applied. */
  @HostBinding('class.m-productPageFeatHighlight__host--right')
  public rightAlign: boolean = false;

  /** Whether dark mode should be applied, based on colour scheme. */
  @HostBinding('class.m-productPageFeatHighlight__host--dark')
  public darkMode: boolean = false;

  /** Whether light mode should be applied, based on colour scheme. */
  @HostBinding('class.m-productPageFeatHighlight__host--light')
  public lightMode: boolean = false;

  constructor(@Inject(STRAPI_URL) public strapiUrl: string) {}

  ngOnInit(): void {
    if (this.alignImage === AlignImage.Left) {
      this.leftAlign = true;
    } else {
      this.rightAlign = true;
    }

    if (this.colorScheme === ColorScheme.Dark) {
      this.darkMode = true;
    } else {
      this.lightMode = true;
    }
  }
}
