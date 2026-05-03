export interface ArticleTag {
  tagId: number;
  tagName: string;
  tagUrl: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  imageCredit: string;
  date: string;
  tags: ArticleTag[];
  body: string;
}
