import { Component, OnInit } from '@angular/core';
import {
  UpgradePageCard,
  UpgradePageConfigPrices,
  UpgradePageRow,
  UpgradePageRowEntity,
  UpgradePageToggleValue,
} from '../upgrade.types';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { ProductPageUpgradesConfig } from '../../about/product-pages/product-pages.types';
import { WireUpgradeType } from '../../wire/v2/wire-v2.service';
import { MindsUser } from '../../../interfaces/entities';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import { ModalService } from '../../../services/ux/modal.service';
import { WireCreatorComponent } from '../../wire/v2/creator/wire-creator.component';
import {
  Enum_Upgradepage_Rowtype as UpgradePageRowType,
  Enum_Upgradepage_Cardid as UpgradePageCardId,
  UpgradePageGQL,
  UpgradePageQuery,
} from '../../../../graphql/generated.strapi';
import { ApolloQueryResult } from '@apollo/client';
import { Session } from '../../../services/session';

export type UpgradePageModalData = {
  isModal: boolean;
  onDismissIntent: () => any;
  onWireModalDismissIntent: () => any;
  onUpgradeComplete: () => any;
};

@Component({
  selector: 'm-upgradePage',
  templateUrl: './upgrade-page.component.html',
  styleUrls: ['./upgrade-page.component.ng.scss'],
})
export class UpgradePageComponent implements OnInit {
  protected upgradeCards: UpgradePageCard[] = [];

  protected toggle$: BehaviorSubject<UpgradePageToggleValue> =
    new BehaviorSubject<UpgradePageToggleValue>('upgrade');

  readonly cdnAssetsUrl: string;

  /** Upgrades config. */
  public readonly upgradesConfig: ProductPageUpgradesConfig;

  /**
   * Monthly prices from configs. Hero price is lowest of all the prices from configs
   */
  private configPrices: UpgradePageConfigPrices = {};

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Wire modal was dismissed without
   * a completed upgrade
   */
  onWireModalDismissIntent: () => void = () => {};

  /**
   * User upgraded to plus or pro
   */
  onUpgradeComplete: () => void = () => {};

  /**
   * Is this being displayed as a modal?
   * (If not, it's a standalone page)
   * */
  isModal: boolean = false;

  constructor(
    private upgradePageGQL: UpgradePageGQL,
    private modalService: ModalService,
    private readonly wirePaymentHandlers: WirePaymentHandlersService,
    configs: ConfigsService,
    public session: Session
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.upgradesConfig = configs.get<ProductPageUpgradesConfig>('upgrades');
  }

  ngOnInit(): void {
    this.getConfigPrices();
    this.prepareCards();
  }
  /**
   * Loop through the data and organize it into the UpgradePageCards structure
   * **/
  private async prepareCards(): Promise<void> {
    const response: ApolloQueryResult<UpgradePageQuery> = await firstValueFrom(
      this.upgradePageGQL.fetch()
    );

    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      return;
    }

    // Loop through the all the rows and group it into card objects
    response?.data?.upgradePages?.data.forEach((item: UpgradePageRowEntity) => {
      const {
        cardId,
        rowType,
        displayText,
        priceTextArray,
        iconId,
        iconSource,
      } = item.attributes;

      // Create a new row from the data
      const newRow: UpgradePageRow = {
        cardId,
        rowType,
        displayText,
        priceTextArray,
        iconId,
        iconSource,
      };

      if (newRow.rowType === UpgradePageRowType.Price) {
        newRow['priceTextArray'] = this.getPriceTextArray(newRow);
      }
      // Create the card if it doesn't exist
      // and add the row to the 'upgradeCards' array
      let foundCard = this.upgradeCards.find(
        (card) => card[0].cardId === cardId
      );
      if (!foundCard) {
        foundCard = [];
        this.upgradeCards.push(foundCard);
      }
      foundCard.push(newRow);
    });

    this.confirmPrices();
    this.sortCards();
    this.sortRows();
  }

  /**
   * Make sure the upgrade cards are in the right display order
   */
  private sortCards(): void {
    const order: UpgradePageCardId[] = [
      UpgradePageCardId.Hero,
      UpgradePageCardId.Plus,
      UpgradePageCardId.Pro,
      UpgradePageCardId.Networks,
    ];

    this.upgradeCards.sort(
      (a, b) => order.indexOf(a[0].cardId) - order.indexOf(b[0].cardId)
    );
  }

  /**
   * Make sure the card rows are in the right display order
   *
   * (Bullets are already in the right order as specified in query)
   */
  private sortRows(): void {
    const order: UpgradePageRowType[] = [
      UpgradePageRowType.Title,
      UpgradePageRowType.Price,
      UpgradePageRowType.LinkText,
      UpgradePageRowType.Bullet,
    ];

    for (let rows of this.upgradeCards) {
      rows.sort((a, b) => order.indexOf(a.rowType) - order.indexOf(b.rowType));
    }
  }

  /**
   * Replace hardcoded prices with those from configs, if possible
   */
  private confirmPrices(): void {
    for (let card of this.upgradeCards) {
      for (let row of card) {
        if (row.rowType === UpgradePageRowType.Price) {
          if (
            this.configPrices &&
            this.configPrices[row.cardId] &&
            this.configPrices[row.cardId] !== undefined
          ) {
            row.priceTextArray[1] = this.configPrices[row.cardId];
          }
        }
      }
    }
  }

  /**
   * Get prices from database.
   */
  private getConfigPrices(): void {
    // Get the yearly prices and divide by 12 to ensure we grab the lowest  price per month
    this.configPrices[UpgradePageCardId.Plus] =
      this.upgradesConfig.plus.yearly.usd / 12;
    this.configPrices[UpgradePageCardId.Pro] =
      this.upgradesConfig.pro.yearly.usd / 12;

    // TODO: Get from config on release of networks.

    this.configPrices[UpgradePageCardId.Hero] = this.getLowestPrice();
  }

  /**
   * Separate the price string into an array.
   * The price part of the string (e.g. {{$5}}) will be displayed in bold
   * @param row - the "price" row for this card
   * @returns textArray string[]
   */
  protected getPriceTextArray(row: UpgradePageRow): string[] {
    const matches = row.displayText.match(/(.*?)\{\{(.*?)\}\}(.*)/);

    if (!matches || matches.length === 3 || matches.length > 4) {
      return [row.displayText];
    }

    // Strip the dollar sign from the price for now
    let priceTextArray = [matches[1], matches[2].replace(/\$/g, '')];

    if (matches[3]) {
      priceTextArray.push(matches[3]);
    }

    return priceTextArray;
  }

  /**
   * Gets the lowest price from the products
   * from configs.
   *
   * Used to populate "subscriptions starting at..."
   * price in the hero card
   * @returns number
   */
  private getLowestPrice(): number {
    // Initialize with really high value
    let lowestPrice = Number.POSITIVE_INFINITY;

    // Overwrite each time you loop through a lower price
    for (let key in this.configPrices) {
      if (this.configPrices.hasOwnProperty(key)) {
        if (this.configPrices[key] < lowestPrice) {
          lowestPrice = this.configPrices[key];
        }
      }
    }
    return lowestPrice;
  }

  protected isHero(card: UpgradePageCard): boolean {
    return card.some((row) => row.cardId === UpgradePageCardId.Hero);
  }

  protected getCardIdClass(cardId: UpgradePageCardId): string {
    return `m-upgradePage__card--${cardId}`;
  }

  protected cardTrackByFn(index: number, card: any): number {
    return card[0].cardId;
  }

  protected rowTrackByFn(index: number, row: any): number {
    return row.displayText;
  }

  protected async openWireModal(type: WireUpgradeType): Promise<void> {
    let entity: MindsUser = await this.wirePaymentHandlers.get(type);

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        isSendingGift: this.toggle$.getValue() === 'gift',
        entity: entity,
        default: {
          type: 'money',
          upgradeType: type,
          upgradeInterval: 'yearly',
        },
        onComplete: (result: boolean) => {
          if (result) {
            modal.close();
            this.onUpgradeComplete();

            if (!this.isModal) window.location.reload();
          }
        },
      },
    });
  }

  /**
   * Set modal data.
   * @param { UpgradePageModalData } data - data for upsell modal
   */
  public setModalData({
    isModal,
    onDismissIntent,
    onWireModalDismissIntent,
    onUpgradeComplete,
  }: UpgradePageModalData) {
    this.isModal = isModal;
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onWireModalDismissIntent = onWireModalDismissIntent ?? (() => {});
    this.onUpgradeComplete = onUpgradeComplete ?? (() => {});
  }
}
