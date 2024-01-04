import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';

/** Config values for Marked. */
type MarkedOptionsFactoryConfig = {
  anchorTargets?: '_blank' | '_self' | '_parent' | '_top';
};

/**
 * Marked options factory - can be passed at module level to configure
 * Marked within a whole module's scope.
 * @param { MarkedOptionsFactoryConfig } config - config.
 * @returns { Function } - Function evaluating to marked options.
 */
export function markedOptionsFactory(
  config: MarkedOptionsFactoryConfig
): Function {
  return (): MarkedOptions => {
    const renderer = new MarkedRenderer();
    const linkRenderer = renderer.link;

    if (config.anchorTargets) {
      renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, `<a target="${config.anchorTargets}"`);
      };
    }

    return {
      renderer,
    };
  };
}
