/**
 * A tag returned by `GET /api/tags/{id}`.
 * Mirrors the backend `Tag` model from `Data/jsonDataTags.txt`.
 * Tags have their own dedicated page at `/tags/{tagId}`.
 */
export interface Tag {
  /** Unique numeric identifier for the tag. */
  tagId: number;
  /** Display name of the tag (e.g. "בנימין נתניהו"). */
  tagName: string;
  /**
   * Absolute URL of the tag's representative image.
   * May be an empty string if the tag has no image; the frontend renders it conditionally.
   */
  tagImage: string;
}
