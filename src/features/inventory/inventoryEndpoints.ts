const InventoryBase: string = "/inventories";

const InventoryEndpoint = {
  // POST: upload Excel file để nhập hàng cho 1 store
  importGoods: (storeId: string) => `${InventoryBase}/import/${storeId}`,

  // GET: lấy danh sách hàng tồn kho của 1 store
  getInventoryByStore: (storeId: string) => `${InventoryBase}/import/${storeId}`,
};

export default InventoryEndpoint;
