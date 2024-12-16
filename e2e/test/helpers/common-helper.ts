import Helper from '@codeceptjs/helper';
import { Request } from 'playwright';

// generic route response.
type MindsGenericRouteResponse = {
  status: number;
  contentType: string;
  body: string;
};

/**
 * Common helpers to be accessed through I. e.g. `await I.clickAndWait(foo, bar);`
 * Make sure to run `npm run def` to update typings after adding a new helper.
 */
class CommonHelper extends Helper {
  /**
   * Click an element and wait for a response.
   * @param { CodeceptJS.Locator } locator - locator to click.
   * @param { string } urlSnippet - snippet of response URL to listen for.
   * @param { number } status - expected response status.
   * @returns { any } response.
   */
  public async clickAndWait(
    locator: CodeceptJS.LocatorOrString,
    urlSnippet: string,
    status: number = 200
  ): Promise<any> {
    const { Playwright } = this.helpers;
    const [response] = await Promise.all([
      Playwright.waitForResponse(
        (resp) => resp.url().includes(urlSnippet) && resp.status() === status
      ),
      Playwright.click(locator),
    ]);
    return response;
  }

  /**
   * Click an element and wait for a response with a specific GraphQL operation name.
   * @param { CodeceptJS.LocatorOrString } locator - locator to click.
   * @param { string } operationName - GQL operation name to listen for.
   * @param { number } status - expected response status.
   * @returns { Promise<Response> } response object.
   */
  public async clickAndWaitGqlOperation(
    locator: CodeceptJS.LocatorOrString,
    operationName: string,
    status: number = 200
  ): Promise<Response> {
    const { Playwright } = this.helpers;
    const [response] = await Promise.all([
      Playwright.waitForResponse(async (resp) => {
        const request = await resp.request();

        if (!request.url().includes('/api/graphql')) {
          return false;
        }

        if (resp.status() !== status) {
          return false;
        }

        try {
          const postData: Object = JSON.parse(await request.postData());
          return (
            Boolean(postData['operationName']) &&
            postData['operationName'] === operationName
          );
        } catch (e: unknown) {
          console.error(e);
          return false;
        }
      }),
      Playwright.click(locator),
    ]);
    return response;
  }

  /**
   * Set the value of a range input.
   * Note this MAY NOT WORK LOCALLY - in some browsers it will set the slider position
   * NOT the actual value held by the slider.
   * @param { string } selector - selector to set for.
   * @param { number } amount - amount value to set.
   * @returns { Promise<void> }
   */
  public async setRangeInputValue(
    selector: string,
    amount: number
  ): Promise<void> {
    const { page } = this.helpers.Playwright;

    await page.$eval(
      selector,
      (e, value) => {
        e.value = value;
        e.dispatchEvent(new Event('input', { bubbles: true }));
        e.dispatchEvent(new Event('change', { bubbles: true }));
      },
      amount
    );
  }

  /**
   * Mock a route while bypassing the service worker. For some requests the service worker
   * will intercept and prevent you from mocking the route. This method will temporarily set
   * the Nsgw-Bypass header to 1, mock the route, and then set the header back to '' and stop
   * mocking the route when a match for the route has been completed.
   *
   * Note this WILL bypass service workers until the route has been matched!
   *
   * @param { string } route - route to match; can be a regex string.
   * @param { MindsGenericRouteResponse } response - the response you want the route to return. Ensure the body is a string.
   * @param { function({request: Request}):boolean } additionalMatchCondition - optional callback function to add an additional
   *  match condition. Is useful if the same route is used for multiple requests and you want to
   *  mock only one of them. (e.g. for graphql).
   * @returns { Promise<void> }
   */
  public async mockRouteAndBypassServiceWorker(
    route: string,
    response: MindsGenericRouteResponse,
    additionalMatchCondition: (request: Request) => boolean = () => true
  ): Promise<void> {
    const { Playwright } = this.helpers;

    // Set service worker bypass header to 1
    Playwright.haveRequestHeaders({
      'Ngsw-Bypass': '1',
    });

    Playwright.mockRoute(route, (route: any): void => {
      if (
        !additionalMatchCondition ||
        additionalMatchCondition(route.request())
      ) {
        // Stop mocking the route and reset service worker bypass header.
        Playwright.stopMockingRoute(route);
        Playwright.haveRequestHeaders({
          'Ngsw-Bypass': '',
        });
        return route.fulfill(response);
      }
      return route.continue();
    });
  }
}

export = CommonHelper;
