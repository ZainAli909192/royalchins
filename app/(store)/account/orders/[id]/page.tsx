import { OrderDetails } from "@/components/store/account/order-details";

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;

  return <OrderDetails key={orderId} />;
}