import Helper from '@codeceptjs/helper';
import jwt from 'jsonwebtoken';

class CookieHelper extends Helper {
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
   * Set MFA bypass cookie.
   * @returns { this }
   */
  public setMFABypassCookie(code: string): this {
    const sharedKey = process.env.BYPASS_SIGNING_KEY;

    if (sharedKey) {
      const token = jwt.sign({ data: code }, sharedKey, {
        expiresIn: '5m',
      });

      this.setCookie({
        name: 'two_factor_bypass',
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
    const { Playwright } = this.helpers;
    Playwright.usePlaywrightTo('set Cookie', async ({ browserContext }) => {
      await browserContext.addCookies([cookie]);
    });

    return this;
  }
}

export = CookieHelper;
