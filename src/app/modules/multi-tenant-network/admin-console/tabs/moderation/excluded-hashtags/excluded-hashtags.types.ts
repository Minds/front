/**
 * Represents an excluded hashtag.
 */
export interface ExcludedHashtag {
  id: string;
  tag: string;
  createdTimestamp: number;
}

/**
 * Represents an edge in a list of excluded hashtags.
 */
export interface ExcludedHashtagEdge {
  node: ExcludedHashtag;
  cursor: string;
}
