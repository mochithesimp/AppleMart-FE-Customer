import { getProductImgs } from "../../apiServices/ProductServices/productImgSevices";
import { search } from "../../apiServices/ProductServices/productItemServices";
import { useEffect, useState } from "../../import/import-another";
import { ProductImg, ProductItem } from "../../interfaces";

const useProductFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cateBy, setCateBy] = useState<number>(0);
  const [sortBy, setSortBy] = useState("");
  const [colorBy, setColorBy] = useState("");
  const [RamBy, setRamBy] = useState("");
  const [RomBy, setRomBy] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [activePrice, setActivePrice] = useState("");
  const [activeCate, setActiveCate] = useState<string | number>("");
  const [activeRam, setActiveRam] = useState("");
  const [activeRom, setActiveRom] = useState("");
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchProductsByFilter = async () => {
      const queryParams = new URLSearchParams();

      // Định nghĩa ánh xạ cho các giá trị sortBy
      const filterMap: Record<string, Record<string, string>> = {
        price: { PriceSort: "lowtohigh" },
        priceDesc: { PriceSort: "hightolow" },
        "400-800": { MinPrice: "400", MaxPrice: "800" },
        "800-1200": { MinPrice: "800", MaxPrice: "1200" },
        "1200-2000": { MinPrice: "1200", MaxPrice: "2000" },
        under400: { MaxPrice: "400" },
        Above2000: { MinPrice: "2000" },
      };

      // Nếu sortBy tồn tại trong filterMap, thêm các tham số vào queryParams
      if (sortBy in filterMap) {
        Object.entries(filterMap[sortBy]).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }

      const filterColorMap: Record<string, Record<string, string>> = {
        Black: { Colors: "Black" },
        White: { Colors: "White" },
        Blue: { Colors: "Blue" },
        Pink: { Colors: "Pink" },
        Silver: { Colors: "Silver" },
        Gold: { Colors: "Gold" },
        "Navy Blue": { Colors: "Navy Blue" }, // Xanh đen
        Orange: { Colors: "Orange" }, // Cam
        Green: { Colors: "Green" }, // Xanh lá
        Brown: { Colors: "Brown" }, // Nâu
        Beige: { Colors: "Beige" }, // Kem
        Cyan: { Colors: "Cyan" }, // Xanh dương nhạt / Xanh cyan
        Red: { Colors: "Red" }, // Đỏ
        Yellow: { Colors: "Yellow" }, // Vàng
      };

      if (colorBy in filterColorMap) {
        Object.entries(filterColorMap[colorBy]).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }

      const filterRamMap: Record<string, Record<string, string>> = {
        "4GB": { RAMSizes: "4GB" },
        "8GB": { RAMSizes: "8GB" },
        "16GB": { RAMSizes: "16GB" },
        "32GB": { RAMSizes: "32GB" },
      };

      if (RamBy in filterRamMap) {
        Object.entries(filterRamMap[RamBy]).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }

      const filterRomMap: Record<string, Record<string, string>> = {
        "64GB": { RAMSizes: "64GB" },
        "128GB": { RAMSizes: "128GB" },
        "256GB": { RAMSizes: "256GB" },
        "512GB": { RAMSizes: "512GB" },
        "1TB": { RAMSizes: "1TB" },
      };

      if (RomBy in filterRomMap) {
        Object.entries(filterRomMap[RomBy]).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
      }

      if (cateBy) {
        queryParams.append("CategoryId", cateBy.toString());
      }

      if (searchTerm) {
        queryParams.append("SearchTerm", searchTerm);
      }

      queryParams.append("PageNumber", pageNumber.toString());

      // console.log(`Fetching from URL: https://localhost:7140/api/ProductItem?${queryParams.toString()}`);
      const response = await search(queryParams);
      setTotalPages(response.totalPages)
      const productImgsResult = await getProductImgs();

      const productImgs = productImgsResult.$values;

      const imagesByProductItemID = productImgs.reduce(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          acc: { [x: string]: any[] },
          img: { productItemID: string | number }
        ) => {
          if (!acc[img.productItemID]) {
            acc[img.productItemID] = [];
          }
          acc[img.productItemID].push(img);
          return acc;
        },
        {} as Record<number, ProductImg[]>
      );
      // Gán danh sách ảnh vào productItem tương ứng
      const mergedData: ProductItem[] = response?.items?.$values.map((item: ProductItem) => ({
        ...item, // Giữ nguyên dữ liệu từ API
        productImgs: imagesByProductItemID[item.productItemID] || [], // Thêm danh sách ảnh
      }));

      setProductItems(mergedData);
    };
    fetchProductsByFilter();
  }, [RamBy, RomBy, cateBy, colorBy, pageNumber, searchTerm, sortBy]);

  const handlePriceSort = (value: string) => {
    setSortBy(value);
    setActivePrice(value);
  };

  const handleColorSort = (value: string | null) => {
    setColorBy(value || "");
    setActiveColor(value || "");
  };

  const handleRamSort = (value: string | null) => {
    setRamBy(value || "");
    setActiveRam(value || "");
  };

  const handleRomSort = (value: string | null) => {
    setRomBy(value || "");
    setActiveRom(value || "");
  };

  const handleCateSort = (value: number) => {
    setCateBy(value || 0);
    setActiveCate(value || "");
  };

  const resetFilters = () => {
    setCateBy(0);
    setSearchTerm("");
    setSortBy("");
    setColorBy("");
    setRamBy("");
    setRomBy("");
    setActivePrice("");
    setActiveColor("");
    setActiveRam("");
    setActiveRom("");
    setActiveCate("");
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  return {
    productItems,
    activePrice,
    activeColor,
    activeRam,
    activeRom,
    activeCate,
    searchTerm,
    pageNumber,
    totalPages,
    handlePriceSort,
    handleColorSort,
    handleRamSort,
    handleRomSort,
    handlePageChange,
    handleCateSort,
    setSearchTerm,
    setPageNumber,
    resetFilters,
  };
};

export default useProductFilter;
