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
