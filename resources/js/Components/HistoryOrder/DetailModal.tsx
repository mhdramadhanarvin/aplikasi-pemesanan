import { Currency } from "@/Common/Currency";
import Modal from "@/Components/Modal";
import { ItemOrder, OrderType } from "@/types/OrderType";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { DropPointModal } from "./DropPointModal";

interface PaymentModalProps {
    open: boolean;
    handleClose: (close: boolean) => void;
    order: OrderType;
}

export const DetailModal = (
    { open, handleClose, order }: PaymentModalProps,
) => {
    const [openDropPoint, setOpenDropPoint] = useState<boolean>(false);
    const handleCloseModal = () => {
        handleClose(!open);
    };

    return (
        <Modal show={open} onClose={() => { }} maxWidth="lg">
            <div className="px-7 py-5">
                <div className="pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Detail Pesanan
                    </h2>
                </div>
                <div className="grid grid-cols-7">
                    <div className="col-span-5">
                        <div className="py-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Alamat Pengantaran
                            </h3>
                            <p className="text-md">
                                <span className="block">
                                    {order.address_order.name}{" "}
                                    ({order.address_order.phone_number})
                                </span>
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                {order.address_order.address}
                                <span
                                    className="text-blue-500 cursor-pointer mx-1"
                                    onClick={() => setOpenDropPoint(true)}
                                >
                                    (Lihat Titik Pengantaran)
                                </span>
                                {openDropPoint && (
                                    <DropPointModal
                                        origin={order.address_order.origin}
                                        destination={order.address_order.destination}
                                        handleClose={setOpenDropPoint}
                                    />
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="pt-8 pl-5 text-lg">
                        {order.address_order.fee_shipping == 0
                            ? <span className="font-bold">FREE</span>
                            : (
                                Currency(order.address_order.fee_shipping)
                            )}
                    </div>
                </div>
                <div className="">
                    {order.item_orders.map((data: ItemOrder, key: number) => (
                        <div
                            className="py-2 grid grid-cols-4"
                            key={key}
                        >
                            <div className="row-span-3">
                                <img
                                    className="w-16 h-16 rounded-xl"
                                    src={data.thumbnail}
                                    alt="Sunset in the mountains"
                                />
                            </div>
                            <div className="col-span-2 text-lg">
                                {data.product.item_name}
                            </div>
                            <div className="col-span-2 text-lg">
                                {Currency(data.price)}
                            </div>
                            <div className="row-span-2">
                                X {data.quantity}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-1">
                    <h3 className="text-lg font-bold pb-1">
                        Ringkasan Pembayaran
                    </h3>

                    <div className="grid grid-cols-6">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Harga
                            </div>
                        </div>
                        <div className="text-lg">{Currency(order.total_price-order.address_order.fee_shipping)}</div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Biaya Pengiriman
                            </div>
                        </div>
                        <div className="text-lg">
                            {Currency(order.address_order.fee_shipping)}
                        </div>
                    </div>
                    <div className="grid grid-cols-6 text-lg font-bold">
                        <div className="col-span-3">
                            <div className="">
                                Total Pembayaran
                            </div>
                        </div>
                        <div className="">
                            {Currency(order.total_price)}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center pt-5">
                    <SecondaryButton onClick={handleCloseModal}>
                        TUTUP
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};
