import { Order } from './order.model';

const findLastOrderId = async () => {
  const lastOrder = await Order.findOne(
    {},
    {
      orderId: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastOrder?.orderId ? lastOrder.orderId : undefined;
};

export const generateOrderId = async () => {
  const lastOrderId = await findLastOrderId();

  const lastIdNumber = lastOrderId ? parseInt(lastOrderId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  const orderId = `ORD${incrementId}`;
  return orderId;
};
