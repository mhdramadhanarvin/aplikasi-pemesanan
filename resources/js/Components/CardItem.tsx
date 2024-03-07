import { ItemType } from "@/types/ItemType";
import PrimaryButton from "./PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Quantifier } from "./Quantifier";
import { CartType } from "@/types/CartType";
import { Operation } from "./Quantifier/Quantifier";
import useLocalStorageState from "use-local-storage-state";
import { Currency } from "@/Common/Currency";

interface Props {
    item: ItemType;
}

const CardItem = ({ item }: Props) => {
    const [cart, setCart] = useLocalStorageState<CartType>("cart", {});
    const safeCart = cart ?? {};

    const addToCart = (product: ItemType): void => {
        product.quantity = 1;

        setCart((prevCart) => ({
            ...prevCart,
            [product.id]: product,
        }));
    };

    const handleRemoveProduct = (productId: number): void => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            delete updatedCart[productId];
            return updatedCart;
        });
    };

    const isInCart = (productId: number): boolean =>
        Object.keys(cart || {}).includes(productId.toString());

    const handleUpdateQuantity = (id: number, operation: Operation) => {
        setCart((prevCart: any) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[id]) {
                if (operation === "increase") {
                    updatedCart[id] = {
                        ...updatedCart[id],
                        quantity: updatedCart[id].quantity + 1,
                    };
                } else {
                    let totalQty = updatedCart[id].quantity - 1;
                    updatedCart[id] = {
                        ...updatedCart[id],
                        quantity: totalQty,
                    };
                }
            }

            return updatedCart;
        });
    };

    return (
        <div className="col-span-1 flex flex-col max-w-xs h-xs rounded-xl overflow-hidden shadow-2xl p-3">
            <div className="relative">
                <img
                    className="w-full h:52 lg:h-60 rounded-xl"
                    src={item.thumbnail}
                    alt="Sunset in the mountains"
                />
            </div>
            <div className="p-2">
                <div className="text-lg lg:text-xl mb-1">{item.item_name}</div>
                <div className="font-bold text-lg lg:text-xl mb-2">
                    {Currency(item.price)}
                </div>
            </div>
            <div className="p-0">
                {isInCart(item.id)
                    ? (
                        <Quantifier
                            removeProductCallback={() => handleRemoveProduct(item.id)}
                            id={item.id}
                            handleUpdateQuantity={handleUpdateQuantity}
                            initialQuantity={safeCart[item.id]?.quantity || 0}
                        />
                    )
                    : (
                        <PrimaryButton
                            className="w-full text-white justify-center border-2 border-blue-500 rounded-full text-2xl font-bold"
                            onClick={() => {
                                addToCart(item);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-1" />
                            TAMBAH
                        </PrimaryButton>
                    )}
            </div>
        </div>
    );
};

export default CardItem;
