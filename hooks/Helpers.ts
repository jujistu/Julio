export const formattedPrice = (price: number) => {
  const initialPrice = price * 970;

  const formattedPrice = initialPrice.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return formattedPrice;
};
