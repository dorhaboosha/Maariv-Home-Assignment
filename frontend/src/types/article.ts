/**
 * A tag embedded inside an article's `tags` array.
 * Mirrors the backend `ArticleTag` model from `Data/jsonData.txt`.
 */
export interface ArticleTag {
  /** Numeric ID used to navigate to the tag page at `/tags/{tagId}`. */
  tagId: number;
  /** Display name of the tag (e.g. "בנימין נתניהו"). */
  tagName: string;
  /**
   * The canonical URL of the tag on the original Maariv website.
   * Provided by the data source as-is; the frontend uses `tagId` for internal routing instead.
   */
  tagUrl: string;
}

/**
 * A single news article returned by `GET /api/articles/{id}`.
 * Mirrors the backend `Article` model from `Data/jsonData.txt`.
 */
export interface Article {
  /** Unique numeric identifier for the article. */
  id: number;
  /** The article headline. */
  title: string;
  /** Short summary or subtitle displayed beneath the headline. */
  description: string;
  /** Absolute URL of the article's main image. */
  imageURL: string;
  /** Attribution text displayed below the image (photographer or agency name). */
  imageCredit: string;
  /**
   * Publication date as a pre-formatted string (e.g. `"26/02/2024 14:59"`).
   * Rendered with `dir="ltr"` to prevent RTL layout from reversing the date order.
   */
  date: string;
  /** Tags associated with this article. Empty array if the article has no tags. */
  tags: ArticleTag[];
  /**
   * Full article body text. May contain `\n` characters;
   * rendered with `whitespace-pre-line` to preserve line breaks.
   */
  body: string;
}
