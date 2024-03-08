import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import PrimaryButton from "../PrimaryButton";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { addAmount, Currency } from "@/Common/Currency";
import { ItemType } from "@/types/ItemType";
import { useState } from "react";

interface CheckoutModalProps {
    open: boolean;
    handleClose: (close: boolean) => void;
    products: ItemType[];
    totalPrice: number;
}

const CheckoutModal = (
    { open, handleClose, products, totalPrice }: CheckoutModalProps,
) => {
    const [pay, setPay] = useState<boolean>(false);
    const submitOrder = () => {
        // set button disable
        // do something here
        // validate order
        // submit order to db
        // enable button
        // close this modal
        // open payment modal
        // TODO : this below just testing
        setPay(true);
        setTimeout(() => {
            setPay(false);
        }, 2000);
    };
    return (
        <Modal show={open} onClose={handleClose} maxWidth="lg">
            <div className="px-7 py-5">
                <div className="pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Ringkasan Pesanan
                    </h2>
                </div>
                <div className="grid grid-cols-6">
                    <div className="col-span-4">
                        <div className="py-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Alamat Pengantaran
                            </h3>
                            <p className="text-md">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                {/* TODO : get destination from location marker */}
                                JL. AR HAKIM JL. AR HAKIM JL. AR HAKIM JL. AR HAKIM JL. AR HAKIM
                                JL. AR HAKIM JL. AR HAKIM JL. AR HAKIM
                            </p>
                        </div>
                    </div>
                    <div className="pt-8 pl-5 text-lg">{Currency(15000)}</div>
                </div>
                {products.map((data: ItemType, key: number) => (
                    <div
                        className="py-2 grid grid-flow-col  flex content-center"
                        key={key}
                    >
                        <div className="row-span-3">
                            <img
                                className="w-16 rounded-xl"
                                src={data.thumbnail}
                                alt="Sunset in the mountains"
                            />
                        </div>
                        <div className="col-span-2 text-lg">{data.item_name}</div>
                        <div className="col-span-2 text-lg">
                            {Currency(data.price)}
                        </div>
                        <div className="row-span-2">
                            X {data.quantity}
                        </div>
                    </div>
                ))}
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
                        <div className="text-lg">{Currency(totalPrice)}</div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Biaya Pengiriman
                            </div>
                        </div>
                        <div className="text-lg">
                            {/* TODO : calculate from distance resto to destination */}
                            {Currency(15000)}
                        </div>
                    </div>
                    <div className="grid grid-cols-6 text-lg font-bold">
                        <div className="col-span-3">
                            <div className="">
                                Total Pembayaran
                            </div>
                        </div>
                        <div className="">
                            {/* TODO : add amount from distance resto to destination */}
                            {addAmount(totalPrice, 15000, true)}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center pt-5">
                    <PrimaryButton disabled={pay} onClick={() => submitOrder()}>
                        {pay
                            ? <span className="text-lg">Loading...</span>
                            : <span className="text-lg">Pesan Sekarang</span>}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default CheckoutModal;
