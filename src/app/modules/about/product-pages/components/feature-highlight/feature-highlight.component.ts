import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import {
  ComponentDynamicProductPageActionButton as ActionButton,
  Enum_Componentdynamicproductpagefeaturehighlight_Alignimage as AlignImage,
  Enum_Componentdynamicproductpagefeaturehighlight_Colorscheme as ColorScheme,
  UploadFileEntityResponse,
} from '../../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

@Component({
  selector: 'm-productPage__featureHighlight',
  templateUrl: 'feature-highlight.component.html',
  styleUrls: ['feature-highlight.component.ng.scss'],
})
export class ProductPageFeatureHighlightComponent implements OnInit {
  @Input() public readonly title: string;
  @Input() public readonly body: string;
  @Input() public readonly button: ActionButton;
  @Input() public readonly colorScheme: ColorScheme;
  @Input() public readonly image: UploadFileEntityResponse;
  @Input() public readonly alignImage: AlignImage;
  @HostBinding('style.background-color')
  @Input()
  public readonly backgroundColor: string;

  @HostBinding('class.m-productPageFeatHighlight__host--left')
  public leftAlign: boolean = false;
  @HostBinding('class.m-productPageFeatHighlight__host--right')
  public rightAlign: boolean = false;

  @HostBinding('class.m-productPageFeatHighlight__host--dark')
  public darkMode: boolean = false;
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
