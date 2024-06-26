import Locator = CodeceptJS.Locator;
import { WalletSubPage } from '../types/wallet.types';

const { I, sidebarComponent } = inject();
class WalletPage {
  private readonly baseUrl: string = '/wallet';
  private creditsTabSelector: string = '[data-ref=wallet-tab-credits]';

  private readonly joinRewardsButton: Locator =
    locate('m-button').withText('Join Rewards');

  public navigateTo(subPageUrl: WalletSubPage = 'tokens/rewards'): void {
    I.amOnPage(`${this.baseUrl}/${subPageUrl}`);
  }

  /**
   * @return Promise<void>
   */
  public async navigateToFromSidebar(): Promise<void> {
    await Promise.all([
      sidebarComponent.openWallet(),
      I.waitForResponse(
        (resp) => resp.url().includes('') && resp.status() === 200,
        30
      ),
    ]);
  }

  public clickJoinRewards(): void {
    I.click(this.joinRewardsButton);
  }

  /**
   * Click the credits tab.
   * @returns { void }
   */
  public clickCreditsTab(): void {
    I.click(this.creditsTabSelector);
  }
}

export = new WalletPage();
