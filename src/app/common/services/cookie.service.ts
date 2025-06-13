import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

/** Value for cookie same site attribute. */
type SameSiteValue = 'Lax' | 'None' | 'Strict';

/** Cookie object. */
export type Cookie = {
  name: string;
  value: string;
};

/** Options for setting a cookie. */
export type SetCookieOptions = {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSiteValue;
  partitioned?: boolean;
};

@Injectable({ providedIn: 'root' })
export class CookieService {
  /** Whether the document can be accessed. */
  private readonly canAccessDocument: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.canAccessDocument = !isPlatformServer(this.platformId);
  }

  /**
   * Gets the value of a cookie.
   * @param { string } name - The name of the cookie.
   * @returns { string | null } The value of the cookie.
   */
  public get(name: string): string | null {
    if (!this.canAccessDocument) {
      return null;
    }

    try {
      const value = this.document.cookie
        .split('; ')
        .find((cookieValue: string): boolean =>
          cookieValue.startsWith(`${name}=`)
        )
        ?.split('=')[1];

      return value ? decodeURIComponent(value) : null;
    } catch (e: unknown) {
      console.error(e);
      return null;
    }
  }

  /**
   * Checks if a cookie exists.
   * @param { string } name - The name of the cookie.
   * @returns { boolean } Whether the cookie exists.
   */
  public check(name: string): boolean {
    if (!this.canAccessDocument) {
      return false;
    }

    try {
      return (
        this.document.cookie
          .split(';')
          .some((cookieValue: string): boolean =>
            cookieValue.trim().startsWith(`${name}=`)
          ) ?? false
      );
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }

  /**
   * Sets the value of a cookie.
   * @param { string } name - The name of the cookie.
   * @param { string } value - The value of the cookie.
   * @param { SetCookieOptions } options - Additional options for the cookie.
   * @returns { void }
   */
  public set(name: string, value: string, options?: SetCookieOptions): void {
    if (!this.canAccessDocument) {
      return;
    }

    try {
      let cookieValue: string = `${name}=${encodeURIComponent(value)}`;

      if (options?.expires) {
        cookieValue += `; expires=${options.expires.toUTCString()}`;
      }

      if (options?.path) {
        cookieValue += `; path=${options.path}`;
      }

      if (options?.domain) {
        cookieValue += `; domain=${options.domain}`;
      }

      if (options?.secure) {
        cookieValue += '; secure';
      }

      if (options?.sameSite) {
        cookieValue += `; SameSite=${options.sameSite}`;
      }

      if (options?.partitioned) {
        cookieValue += '; Partitioned';
      }

      this.document.cookie = cookieValue;
    } catch (e: unknown) {
      console.error(e);
    }
  }

  /**
   * Deletes a cookie.
   * @param { string } name - The name of the cookie.
   * @param { string } path - The path of the cookie.
   * @param { string } domain - The domain of the cookie.
   * @returns { void }
   */
  public delete(name: string, path?: string, domain?: string): void {
    if (!this.canAccessDocument) {
      return;
    }

    this.set(name, '', {
      expires: new Date(0),
      path,
      domain,
    });
  }

  /**
   * Deletes all cookies.
   * @param { string } path - The path of the cookies.
   * @param { string } domain - The domain of the cookies.
   * @returns { void }
   */
  public deleteAll(path?: string, domain?: string): void {
    if (!this.canAccessDocument) {
      return;
    }

    const cookies: Cookie[] = this.getAll();
    for (const cookie of cookies) {
      this.delete(cookie.name, path, domain);
    }
  }

  /**
   * Gets all cookies.
   * @returns { Cookie[] } All cookies.
   */
  public getAll(): Cookie[] {
    if (!this.canAccessDocument) {
      return [];
    }
    try {
      const cookies: Cookie[] = [];
      const cookieArray = this.document.cookie.split(';');

      for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name) {
          cookies.push({
            name,
            value: value ? decodeURIComponent(value) : value,
          });
        }
      }

      return cookies;
    } catch (e: unknown) {
      console.error(e);
      return [];
    }
  }
}
