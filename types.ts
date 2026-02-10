
export interface ProductData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string | null;
}

export interface FormData {
  businessName: string;
  businessDescription: string;
  location: string;
  productA: ProductData;
  productB: ProductData;
  telegram: string;
  email: string;
  financeDetails: string;
}

export enum StepType {
  INTRO,
  NAME,
  DESC,
  LOCATION,
  PROD_A_INFO,
  PROD_A_PRICE,
  PROD_A_IMAGE,
  PROD_B_INFO,
  PROD_B_PRICE,
  PROD_B_IMAGE,
  CONTACT,
  FINANCE,
  SUCCESS
}
