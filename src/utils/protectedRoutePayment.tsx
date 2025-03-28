
const PaymentWrapper = ({ children }: { children: React.ReactNode }) => {

  const storedCart = localStorage.getItem("storedCart");
  const hasItemsInCart =
  storedCart &&
  Object.values(JSON.parse(storedCart)).some(
    (items) => Array.isArray(items) && items.length > 0
  );
  if (!hasItemsInCart) {
    window.history.back();
    return null;
  }

  return children;
};

export default PaymentWrapper;
