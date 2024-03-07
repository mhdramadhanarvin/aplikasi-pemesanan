import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    // faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { CartType } from "@/types/CartType";
import useLocalStorageState from "use-local-storage-state";
import { useState } from "react";
// import { ItemType } from "@/types/ItemType";
import PrimaryButton from "../PrimaryButton";
// import Modal from "../Modal";
import CheckoutModal from "./CheckoutModal";
import { Currency } from "@/Common/Currency";

const CheckoutButton = () => {
    const [cart] = useLocalStorageState<CartType>("cart", {});
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const productsCount: number = Object.keys(cart || {}).length;
    const getProducts = () => Object.values(cart || {});

    const totalPrice = getProducts().reduce(
        (accumulator, product) => accumulator + (product.price * product.quantity),
        0,
    );

    const isCartEmpty = productsCount === 0 ? "hidden" : "show";

    return (
        <>
            <div
                className={`sticky bottom-0 bg-white p-5 flex justify-center ${isCartEmpty}`}
            >
                <PrimaryButton
                    className="grid grid-rows-3 grid-flow-col rounded-xl"
                    onClick={handleOpen}
                >
                    <div className="row-span-3">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            className="text-xl pl-5 pr-7"
                        />
                    </div>
                    <div className="col-span-2 text-md">{productsCount} Item</div>
                    <div className="row-span-2 col-span-2 text-lg">
                        {Currency(totalPrice)}
                    </div>
                </PrimaryButton>
                <CheckoutModal
                    open={open}
                    handleClose={handleClose}
                    products={getProducts()}
                    totalPrice={totalPrice}
                />
            </div>
        </>
    );
};

export default CheckoutButton;