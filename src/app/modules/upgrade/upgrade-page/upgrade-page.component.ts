import { Component, OnInit } from '@angular/core';
import {
  UpgradePageCard,
  UpgradePageCardId,
  UpgradePageRow,
  UpgradePageToggleValue,
} from '../upgrade.types';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-upgradePage',
  templateUrl: './upgrade-page.component.html',
  styleUrls: ['./upgrade-page.component.ng.scss'],
})
export class UpgradePageComponent implements OnInit {
  protected hero: UpgradePageRow[] = [];

  protected upgradeCards: UpgradePageCard[] = [];

  protected toggle$: BehaviorSubject<
    UpgradePageToggleValue
  > = new BehaviorSubject<UpgradePageToggleValue>('upgrade');

  readonly cdnAssetsUrl: string;

  constructor(
    //  ojm  private upgradePageRowsGql:
    protected configs: ConfigsService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.prepareCards();
    console.log('ojm hero', this.hero);
    console.log('ojm upgradeCards', this.upgradeCards);
  }

  /**
   * Loop through the data and organize it into the UpgradePageCards structure
   * **/
  private prepareCards(): void {
    // Loop through the data and filter it into the appropriate objects
    this.ojmFakeData.upgradePages.data.forEach((item: any) => {
      const {
        cardId,
        rowType,
        displayText,
        priceTextArray,
        iconId,
        iconSource,
        bulletOrderWithinCard,
      } = item.attributes;

      // Create a new row from the data
      const newRow: UpgradePageRow = {
        cardId,
        rowType,
        displayText,
        priceTextArray,
        iconId,
        iconSource,
        bulletOrderWithinCard,
      };

      if (newRow.rowType === 'price') {
        newRow['priceTextArray'] = this.getPriceTextArray(newRow.displayText);
      }
      // Separate the hero card from the other ones
      if (cardId === 'hero') {
        this.hero.push(newRow);
      } else {
        // For other cards, create the card if it doesn't exist and add the row to the 'upgradeCards' array
        let foundCard = this.upgradeCards.find(
          card => card[0].cardId === cardId
        );
        if (!foundCard) {
          foundCard = [];
          this.upgradeCards.push(foundCard);
        }
        foundCard.push(newRow);
      }
    });

    this.sortCards();
    this.sortRows();
  }

  /**
   * Make sure the upgrade cards are in the right display order
   */
  private sortCards(): void {
    const order = ['plus', 'pro', 'networks'];

    this.upgradeCards.sort(
      (a, b) => order.indexOf(a[0].cardId) - order.indexOf(b[0].cardId)
    );
  }

  /**
   * Make sure the card rows are in the right display order
   *
   * (Bullets are already in the right order as specified in query)
   * ojm test this
   */
  private sortRows(): void {
    const order = ['title', 'price', 'linkText', 'bullet'];

    for (let rows of this.upgradeCards) {
      rows.sort((a, b) => order.indexOf(a.rowType) - order.indexOf(b.rowType));
    }

    this.hero.sort(
      (a, b) => order.indexOf(a.rowType) - order.indexOf(b.rowType)
    );
  }

  /**
   * Separate the price string into an array
   * where the middle item (e.g. $5) will be displayed in bold
   * @param displayText
   * @returns textArray string[]
   */
  protected getPriceTextArray(displayText): string[] {
    const matches = displayText.match(/(.*?)\{\{(.*?)\}\}(.*)/);

    console.log('ojm matches', displayText, matches);

    if (matches && matches.length === 4) {
      return [matches[1], matches[2], matches[3]];
    } else {
      return [displayText, '', ''];
    }
  }

  protected getCardIdClass(cardId: UpgradePageCardId): string {
    return `m-upgradePage__card--${cardId}`;
  }

  protected clickedPlusButton($event): void {
    // ojm todo
  }

  protected clickedProButton($event): void {
    // ojm todo
  }

  protected clickedNetworksButton($event): void {
    // ojm todo
  }

  protected cardTrackByFn(index: number, card: any): number {
    return card[0].cardId;
  }

  protected rowTrackByFn(index: number, row: any): number {
    return row.displayText;
  }

  // ojm remove //////////////////////////////
  ojmFakeData: any = {
    upgradePages: {
      data: [
        {
          attributes: {
            cardId: 'networks',
            rowType: 'bullet',
            displayText: 'Host with your own domain',
            iconId: '/icons/web-plus.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: 1,
          },
        },

        {
          attributes: {
            cardId: 'networks',
            rowType: 'bullet',
            displayText:
              'Complete control of the server, including custom brand and themes',
            iconId: '/icons/palette-swatch.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: 2,
          },
        },
        {
          attributes: {
            cardId: 'networks',
            rowType: 'bullet',
            displayText: 'Add administrators and moderate channels',
            iconId: '/icons/account-edit.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: 3,
          },
        },
        {
          attributes: {
            cardId: 'pro',
            rowType: 'bullet',
            displayText: 'Get more reach for your posts and content',
            iconId: 'trending_up',
            iconSource: 'material',
            bulletOrderWithinCard: 3,
          },
        },
        {
          attributes: {
            cardId: 'pro',
            rowType: 'bullet',
            displayText:
              'Customize your channel with your own theme, brand and logo',
            iconId: 'palette',
            iconSource: 'material',
            bulletOrderWithinCard: 2,
          },
        },
        {
          attributes: {
            cardId: 'pro',
            rowType: 'bullet',
            displayText: 'All the benefits of Plus',
            iconId: '/icons/binoculars.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: 1,
          },
        },
        {
          attributes: {
            cardId: 'plus',
            rowType: 'bullet',
            displayText: 'Greater video storage',
            iconId: 'add_to_queue',
            iconSource: 'material',
            bulletOrderWithinCard: 3,
          },
        },
        {
          attributes: {
            cardId: 'plus',
            rowType: 'bullet',
            displayText: 'Get more reach and engagement',
            iconId: 'trending_up',
            iconSource: 'material',
            bulletOrderWithinCard: 2,
          },
        },
        {
          attributes: {
            cardId: 'plus',
            rowType: 'bullet',
            displayText: 'Hide Boosts for an ad-free Minds',
            iconId: 'visibility_off',
            iconSource: 'material',
            bulletOrderWithinCard: 1,
          },
        },
        {
          attributes: {
            cardId: 'hero',
            rowType: 'title',
            displayText: 'Unleash the full Minds experience',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'hero',
            rowType: 'price',
            displayText: 'Subscriptions start at {{$5}} per month',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'hero',
            rowType: 'linkText',
            displayText: 'Learn more about our products',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'plus',
            rowType: 'title',
            displayText: 'Minds+',
            iconId: 'add_to_queue',
            iconSource: 'material',
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'pro',
            rowType: 'title',
            displayText: 'Minds Pro',
            iconId: '/badges/proDark.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'networks',
            rowType: 'title',
            displayText: 'Networks',
            iconId: '/icons/network-pos.svg',
            iconSource: 'svg',
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'plus',
            rowType: 'price',
            displayText: 'Starting at {{$5}} / month',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'pro',
            rowType: 'price',
            displayText: 'Starting at {{$50}} / month',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
        {
          attributes: {
            cardId: 'networks',
            rowType: 'price',
            displayText: 'Starting at {{$50}} / month',
            iconId: null,
            iconSource: null,
            bulletOrderWithinCard: null,
          },
        },
      ],
    },
  };
}
