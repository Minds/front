import Helper from '@codeceptjs/helper';

/**
 * Common helpers to be accessed through I. e.g. `await I.clickAndWait(foo, bar);`
 * Make sure to run `npm run def` to update typings after adding a new helper.
 */
class CommonHelper extends Helper {
  /**
   * Click an element and wait for a response.
   * @param { CodeceptJS.Locator } locator - locator to click.
   * @param { string } urlSnippet - snippet of URL to listen for.
   * @param { number } status - expected response status.
   * @returns { any } response.
   */
  public async clickAndWait(
    locator: CodeceptJS.Locator,
    urlSnippet: string,
    status: number = 200
  ): Promise<any> {
    const { Playwright } = this.helpers;
    const [response] = await Promise.all([
      Playwright.waitForResponse(
        resp => resp.url().includes(urlSnippet) && resp.status() === status
      ),
      Playwright.click(locator),
    ]);
    return response;
  }
}

export = CommonHelper;
