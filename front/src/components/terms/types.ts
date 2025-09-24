export interface TermsItem {
  id: string;
  title: string;
  isRequired: boolean;
  isChecked: boolean;
  hasDetail?: boolean;
  detailType?: string;
  detailTitle?: string;
}

export interface TermsItemComponentProps {
  item: TermsItem;
  index: number;
  onItemCheck: (id: string) => void;
  onDetailPress: (type: string, title: string) => void;
}

export interface TermsHeaderProps {
  title: string;
}
