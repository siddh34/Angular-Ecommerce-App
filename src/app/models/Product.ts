export interface Product {
  quantity: number;
  id: any;
  name: string;
  imageUrl:any;
  description: string;
  price: number;
  variants: Variant[];
}

export interface Variant {
  id:any,
  variantName: string;
  variantDetails: string;
}