import { useEffect, useState } from "react";
import img1 from "../../assets/Product/earphone.png";
import NavbarforP from "../../components/NavbarProduct/NavbarforP";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import { getProductItemAttributes } from "../../apiServices/ProductServices/productItemAttributeServices";
import { Attribute, ProductItem, ProductItemAttribute } from "../../interfaces";
import { useAllProduct } from "../../context/ShopContext";
import { getAttributes } from "../../apiServices/ProductServices/attributeServices";
import { HandleAddToCart } from "../Cart-page/components/HandleAddToCart";
import { useProductRatings } from "../../hooks/useProductRatings";

const ProductDetails = () => {
  const { productItemId } = useParams();
  const { productItems } = useAllProduct();
  const [productItemAttributes, setProductItemAttributes] = useState<
    ProductItemAttribute[]
  >([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [productItem, setProductItem] = useState<ProductItem>();
  const { getRatingForProduct, loading } = useProductRatings();
  // console.log("productItemId: ", productItems)
  const { handleAddToCart } = HandleAddToCart();
  const HandleAddToCartClick = (productItem: ProductItem) => {
    handleAddToCart(productItem);
  };

  useEffect(() => {
    const fetchData = async () => {
      const productItemAttributes = await getProductItemAttributes();

      if (productItemAttributes && productItemAttributes.$values) {
        setProductItemAttributes(productItemAttributes.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      const response = await getAttributes(); // Gọi API lấy danh sách thuộc tính
      if (response && response.$values) {
        setAttributes(response.$values);
      } else {
        console.error("Data not found or invalid response structure");
      }
    };
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (productItemId) {
      const selectedProductItem = productItems.find(
        (pi) => pi.productItemID === parseInt(productItemId)
      );

      if (selectedProductItem) {
        setProductItem({
          ...selectedProductItem,
          productItemAttributes: productItemAttributes.filter(
            (pia) => pia.productItemID === parseInt(productItemId)
          ),
        });
      }
    }
  }, [productItemId, productItems, productItemAttributes]);

  const product = {
    name: "Long Sleeve Overshirt, Khaki",
    brand: "John Lewis ANYDAY",
    originalPrice: 40.0,
    discountedPrice: 28.0,
    sold: 1238,
    rating: 4.5,
    description:
      "Boba etiam ut bulla tea est potus dilectus singulari compositione saporum et textuum...",
    colors: ["#5A4C35", "#EAEAEA", "#476C9B", "#0A0A0A"],
    sizes: [6, 8, 10, 14, 18, 20],
    images: [img1, img1, img1, img1],
    storage: ["268GB", "64GB"],
  };
  const firstWord = productItem?.name?.split(" ")[0] || "";
  const breadcrumbPaths = [
    { name: "Home", link: "/" },
    { name: firstWord, link: "/ProductMenu" },
    { name: productItem?.name || "Loading...", link: "/women/shirts-tops" },
  ];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (productItem?.productImgs?.length) {
      setSelectedImage(productItem.productImgs[0].imageUrl);
    }
  }, [productItem]);
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <div className="mb-16">
        <NavbarforP />
      </div>
      <div className="bg-white dark:bg-gray-900 dark:text-white w-[100%] h-[40px] fixed mb-10"></div>
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8 mt-36">
        {productItem ? (
          <>
            {/* Left: Product Images */}
            <div>
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full rounded-lg shadow"
              />
              <div className="flex gap-2 mt-4">
                {productItem.productImgs.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt="Product preview"
                    className={`w-16 h-16 rounded cursor-pointer border-2 ${selectedImage === img.imageUrl ? "border-black" : "border-gray-300"
                      }`}
                    onClick={() => setSelectedImage(img.imageUrl)}
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div>
              <h2 className="text-2xl font-bold">{productItem.name}</h2>
              <p className="text-gray-500">Available: {productItem.quantity}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="line-through text-gray-400">
                  ${productItem.price.toLocaleString()}
                </span>
                <span className="text-xl font-semibold text-red-600">
                  ${product.discountedPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {product.sold} Sold ⭐ {
                  productItemId && !loading
                    ? getRatingForProduct(parseInt(productItemId)).averageRating.toFixed(1)
                    : '0.0'
                } ({
                  productItemId && !loading
                    ? getRatingForProduct(parseInt(productItemId)).totalReviewers || 0
                    : 0
                } reviews)
              </p>
              <p className="mt-4 text-gray-700">{productItem.description}</p>
              {attributes.map((attribute) => {
                // Lọc tất cả các giá trị liên quan đến attributeID
                const relatedValues = productItem?.productItemAttributes
                  .filter(
                    (pia) => Number(pia.attributeID) === attribute.attributeID
                  )
                  .map((pia) => pia.value);

                if (relatedValues.length === 0) return null;

                return (
                  <div key={attribute.attributeID} className="mt-4">
                    <p className="font-semibold">{attribute.attributeName}:</p>
                    <div className="flex gap-2 mt-2">
                      {relatedValues.map((value, index) =>
                        attribute.attributeName.toLowerCase() === "color" ? (
                          // Nếu là thuộc tính "Color", hiển thị nút tròn với màu nền
                          <button
                            key={index}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all ${selectedColor === value
                              ? "border-blue-400 bg-blue-50 text-blue-600"
                              : "border-gray-300 text-gray-800"
                              }`}
                            onClick={() => setSelectedColor(value)}
                          >
                            <span
                              className="w-5 h-5 rounded-full border"
                              style={{ backgroundColor: value.toLowerCase() }}
                            ></span>
                            <span className="text-blue-600 font-medium">
                              {value}
                            </span>
                          </button>
                        ) : (
                          // Các thuộc tính khác hiển thị nút chữ nhật
                          <button
                            key={index}
                            className={`px-4 py-2 border rounded ${selectedStorage === value
                              ? "border-black font-bold"
                              : "border-gray-300"
                              }`}
                            onClick={() => setSelectedStorage(value)}
                          >
                            {value}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800" onClick={() => HandleAddToCartClick(productItem)}>
                  Add To Cart
                </button>
                <Link to="/checkout" className="border px-6 py-3 rounded-lg hover:bg-gray-200">
                  Checkout Now
                </Link>
              </div>
            </div>
          </>
        ) : (
          <Link to="/ProductMenu"></Link>
        )}
      </div>
    </div>
  );
};
export default ProductDetails;
