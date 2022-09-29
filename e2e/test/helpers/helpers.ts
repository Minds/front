import jwt from 'jsonwebtoken';
const { I } = inject();

export class Helpers {
  /**
   * Generate a pseudo-random string.
   * @returns { string } pseudo-random string.
   */
  public generateRandomString(): string {
    return Math.random()
      .toString(36)
      .substr(2, 10);
  }

  /**
   * Set CAPTCHA bypass cookie.
   * @returns { this }
   */
  public setCaptchaBypassCookie(): this {
    const sharedKey = process.env.BYPASS_SIGNING_KEY;

    if (sharedKey) {
      const captcha = 'friendly_captcha_bypass';
      const token = jwt.sign({ data: captcha }, sharedKey, {
        expiresIn: '5m',
      });

      this.setCookie({
        name: 'captcha_bypass',
        value: token,
      });
    }

    return this;
  }

  /**
   * Set rate limit bypass cookie.
   * @returns { this }
   */
  public setRateLimitBypassCookie(): this {
    const sharedKey = process.env.BYPASS_SIGNING_KEY;

    if (sharedKey) {
      const token = jwt.sign({ timestamp_ms: Date.now() }, sharedKey, {
        expiresIn: '5m',
      });

      this.setCookie({
        name: 'rate_limit_bypass',
        value: token,
      });
    }

    return this;
  }

  /**
   * Set a cookie manually. Will default url to process.env.E2E_DOMAIN
   * @returns { this }
   */
  public setCookie(cookie: {
    name: string;
    value: string;
    url?: string;
  }): this {
    if (!cookie.url) {
      cookie.url = process.env.E2E_DOMAIN;
    }

    I.usePlaywrightTo('set Cookie', async ({ browserContext }) => {
      await browserContext.addCookies([cookie]);
    });

    return this;
  }
}
