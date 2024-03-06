import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "./PrimaryButton";
import { CartType } from "@/types/CartType";
import useLocalStorageState from "use-local-storage-state";
import Currency from "@/Common/Currency";

const CheckoutButton = () => {
    const [cart] = useLocalStorageState<CartType>("cart", {});

    const productsCount: number = Object.keys(cart || {}).length;
    const getProducts = () => Object.values(cart || {});

    const totalPrice = getProducts().reduce(
        (accumulator, product) => accumulator + (product.price * product.quantity),
        0,
    );

    return (
        <div className="sticky bottom-0 bg-white p-5 flex justify-center">
            <PrimaryButton className="grid grid-rows-3 grid-flow-col rounded-xl">
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
        </div>
    );
};

export default CheckoutButton;
