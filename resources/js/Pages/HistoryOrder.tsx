import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { OrderStatus, OrderType } from "@/types/OrderType";
import { Currency } from "@/Common/Currency";
import PrimaryButton from "@/Components/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faEye } from "@fortawesome/free-solid-svg-icons";
import { PaymentModal } from "@/Components/Payment/PaymentModal";
import { useEffect, useState } from "react";

export default function HistoryOrder(
    { auth, orders, payOrder }: PageProps<
        { orders: OrderType[]; payOrder: OrderType | null }
    >,
) {
    const [detailOrder, setDetailOrder] = useState<OrderType>(null);
    const [action, setAction] = useState<string>(null);
    const payOpen = (order: OrderType) => {
        setDetailOrder(order);
        setAction("pay");
    };
    const handleClose = () => {
        setDetailOrder(null);
        setAction(null);
    };

    const getStatusLabelAndColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.WAITING_PAYMENT:
                return {
                    label: "Menunggu Pembayaran",
                    color: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
                };
            case OrderStatus.ON_PROGRESS:
                return {
                    label: "Sedang Diproses",
                    color: "bg-blue-50 text-blue-700 ring-blue-700/10",
                };
            case OrderStatus.DELIVERY:
                return {
                    label: "Dalam Pengiriman",
                    color: "bg-green-50 text-green-700 ring-green-600/20",
                };
            case OrderStatus.DONE:
                return {
                    label: "Selesai",
                    color: "bg-gray-50 text-gray-600 ring-gray-500/10",
                };
            case OrderStatus.CANCELED:
                return {
                    label: "Dibatalkan",
                    color: "bg-red-50 text-red-700 ring-red-600/10",
                };
            case OrderStatus.EXPIRED:
                return {
                    label: "Kadaluarsa",
                    color: "bg-red-50 text-red-700 ring-red-600/10",
                };
            default:
                return {
                    label: "Status tidak valid",
                    color: "bg-gray-50 text-gray-600 ring-gray-500/10",
                };
        }
    };

    useEffect(() => {
        if (payOrder) payOpen(payOrder);
    }, [payOrder]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Riwayat Pesanan
                </h2>
            }
        >
            <Head title="Riwayat Pesanan" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-md">
                                <thead className="text-left">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            Tanggal Pemesanan
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            Jumlah Pesanan
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            Total Harga
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            Status
                                        </th>
                                        <th className="px-4 py-2"></th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order: OrderType, key: number) => (
                                        <tr key={key}>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                {order.format_created_at}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {order.item_orders_count} Item
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {Currency(order.total_price)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusLabelAndColor(order.status).color
                                                        }`}
                                                >
                                                    {getStatusLabelAndColor(order.status).label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                {order.status == OrderStatus.WAITING_PAYMENT && (
                                                    <>
                                                        <PrimaryButton onClick={() => payOpen(order)}>
                                                            <FontAwesomeIcon
                                                                icon={faDollarSign}
                                                                className="mx-2"
                                                            />
                                                            Bayar Sekarang
                                                        </PrimaryButton>

                                                        {action == "pay" && (
                                                            <PaymentModal
                                                                open={action == "pay"}
                                                                handleClose={handleClose}
                                                                order={detailOrder}
                                                                totalPrice={detailOrder.total_price}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                                <PrimaryButton className="mx-1">
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        className="mx-2"
                                                    />
                                                    Lihat Detail
                                                </PrimaryButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
