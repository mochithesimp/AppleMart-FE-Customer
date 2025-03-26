import { ProductItem } from "../../../interfaces";
import { swal, swal2, useEffect, useState, useCart } from "../../../import/import-another";

const HandleAddToCart = () => {
  interface CurrentQuantities {
    [key: string]: number;
  }
  const { addToCart } = useCart();
  const [currentQuantities, setCurrentQuantities] = useState<CurrentQuantities>(
    {}
  );

  useEffect(() => {
    const storedQuantitiesStr = localStorage.getItem("currentQuantities");
    const storedQuantities = storedQuantitiesStr
      ? JSON.parse(storedQuantitiesStr)
      : {};
    setCurrentQuantities(storedQuantities);
  }, []);


  const handleAddToCart = (ProductItem: ProductItem) => {
    if (ProductItem.quantity > 0) {
      const newCurrentQuantities = { ...currentQuantities };
      const newQuantity = (newCurrentQuantities[ProductItem.productItemID] || 0) + 1;

      if (newQuantity > ProductItem.quantity) {

        swal2.fire({
          title: `${newCurrentQuantities[ProductItem.productItemID]}/ ${ProductItem.quantity}`,
          text: `You cannot order more than ${ProductItem.quantity} items of this product.`,
          icon: "info",
        }).then(() => {
          return;
        });
      } else {
        newCurrentQuantities[ProductItem.productItemID] = newQuantity;
        setCurrentQuantities(newCurrentQuantities);
        localStorage.setItem(
          "currentQuantities",
          JSON.stringify(newCurrentQuantities)
        );
        addToCart(ProductItem);
      }

    } else {
      try {
        swal({
          title: "Out of stock",
          text: "This product is currently out of stock.",
          icon: "info",
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return { handleAddToCart };
};

export { HandleAddToCart };
