export interface IFormik {
  value: number;
  name: string;
  item: {
    name: string;
    text: string;
    element: string;
    type?: string;
  }[];
}

export interface IFormikItem {
  name?: string;
  text?: string;
  element?: string;
  type?: string;
  [value: string]: any;
}
