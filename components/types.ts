export type ProductData = {
  item: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
};

export type ProductInfo = {
  id: number;
  title: string;
  price: string;
  carouselImages: any;
  color: string;
  size: string;
  oldPrice: string;
  item: any;
};
