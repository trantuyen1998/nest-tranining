export interface PostSearchBody {
  id: number;
  title: string;
  paragraphs: string[];
  authorId: number;
}

export interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface PostCountResult {
  count: number;
}
