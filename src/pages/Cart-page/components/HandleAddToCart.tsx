import { ProductItem } from "../../../interfaces";
import { swal, useEffect, useState, useCart } from "../../../import/import-another";

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
    if (ProductItem.stock > 0) {
      const newCurrentQuantities = { ...currentQuantities };
      const newQuantity = (newCurrentQuantities[ProductItem.productItemID] || 0) + 1;

      // if (newQuantity > ProductItem.stock) {
      //   swal2.fire({
      //     title: `${newCurrentQuantities[ProductItem.productItemID]}/ ${ProductItem.stock}`,
      //     text: `You cannot order more than ${ProductItem.stock} items of this product.`,
      //     icon: "info",
      //   }).then(() => {
      //     return;
      //   });
      // } else {
      //   newCurrentQuantities[ProductItem.productItemID] = newQuantity;
      //   setCurrentQuantities(newCurrentQuantities);
      //   localStorage.setItem(
      //     "currentQuantities",
      //     JSON.stringify(newCurrentQuantities)
      //   );
      //   addToCart(ProductItem);
      // }
      newCurrentQuantities[ProductItem.productItemID] = newQuantity;
      setCurrentQuantities(newCurrentQuantities);
      localStorage.setItem(
        "currentQuantities",
        JSON.stringify(newCurrentQuantities)
      );
      addToCart(ProductItem);
    } else {
      try {
        swal({
          title: "Out of stock",
          text: "This product is currently out of stock, but you can place a pre-order.",
          icon: "info",
          buttons: ["Cancel", "Confirm"],
          dangerMode: true,
        }).then(async (confirm) => {
          if (confirm) {
            addToCart(ProductItem);
          }
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return { handleAddToCart };
};

export { HandleAddToCart };
