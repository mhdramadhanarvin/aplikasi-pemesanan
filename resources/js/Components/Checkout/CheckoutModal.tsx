import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import PrimaryButton from "../PrimaryButton";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { addAmount, Currency } from "@/Common/Currency";
import { ItemType } from "@/types/ItemType";
import { useEffect, useState } from "react";
import { DropPointType } from "@/types/DropPointType";
import { router } from "@inertiajs/react";
import { CartType } from "@/types/CartType";
import useLocalStorageState from "use-local-storage-state";

interface CheckoutModalProps {
    open: boolean;
    handleClose: (close: boolean) => void;
    products: ItemType[];
    totalPrice: number;
    dropPoint: DropPointType;
}

const CheckoutModal = (
    { open, handleClose, products, totalPrice, dropPoint }: CheckoutModalProps,
) => {
    const [pay, setPay] = useState<boolean>(false);
    const [form, setForm] = useState({
        products: {},
        dropPoint: {},
        totalPrice: 0,
    });
    const [_, setCart] = useLocalStorageState<CartType>("cart", {});
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
        setForm({
            products,
            dropPoint,
            totalPrice: totalPrice + dropPoint.fee_shipping,
        });
        setTimeout(() => {
            setPay(false);
            setCart({});
            handleClose(true);
            router.post("/create-order", form);
        }, 2000);
    };

    useEffect(() => {
        setForm({
            products,
            dropPoint,
            totalPrice: totalPrice + dropPoint.fee_shipping,
        });
    }, []);

    return (
        <Modal show={open} onClose={handleClose} maxWidth="lg">
            <div className="px-7 py-5">
                <div className="pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Ringkasan Pesanan
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
                                    {dropPoint.name} ({dropPoint.phone_number})
                                </span>
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                {dropPoint.address}{" "}
                                <b>(Estimasi ~{dropPoint.duration} Menit)</b>
                            </p>
                        </div>
                    </div>
                    <div className="pt-8 pl-5 text-lg">
                        {dropPoint.fee_shipping == 0
                            ? <span className="font-bold">FREE</span>
                            : (
                                Currency(dropPoint.fee_shipping)
                            )}
                    </div>
                </div>
                <div className="">
                    {products.map((data: ItemType, key: number) => (
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
                                {data.item_name}
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
                        <div className="text-lg">{Currency(totalPrice)}</div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Biaya Pengiriman
                            </div>
                        </div>
                        <div className="text-lg">
                            {dropPoint.fee_shipping == 0
                                ? <span className="font-bold">FREE</span>
                                : (
                                    Currency(dropPoint.fee_shipping)
                                )}
                        </div>
                    </div>
                    <div className="grid grid-cols-6 text-lg font-bold">
                        <div className="col-span-3">
                            <div className="">
                                Total Pembayaran
                            </div>
                        </div>
                        <div className="">
                            {addAmount(totalPrice, dropPoint.fee_shipping, true)}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center pt-5">
                    <PrimaryButton
                        disabled={pay}
                        onClick={() => {
                            submitOrder();
                        }}
                    >
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
