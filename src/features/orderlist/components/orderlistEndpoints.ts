const orderlistEndpoints = {
  getPendingOrders: (storeId: string) => `/orders/pending-orders/${storeId}`,
  updateOrderStatus: (orderId: string) => `/orders/${orderId}`,
};

export default orderlistEndpoints;
