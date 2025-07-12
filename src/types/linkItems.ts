export interface LinkItem {
  id: string;
  question: string;
  source: string;
  content?: string | { type: "images"; images: { src: string; alt: string }[] };
}

export interface ListItemComponentProps {
  linkItems: LinkItem[];
}
