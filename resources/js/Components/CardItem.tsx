import Currency from "@/Common/Currency";
import { ItemType } from "@/types/ItemType";
import PrimaryButton from "./PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
    item: ItemType;
}

const CardItem = ({ item }: Props) => {
    return (
        <div className="col-span-1 flex flex-col max-w-xs h-xs rounded overflow-hidden">
            <div className="relative">
                <PrimaryButton className="absolute right-0 bottom-0 m-3 bg-white text-black border-2 border-blue-500 rounded-full">
                    <FontAwesomeIcon icon={faPlus} />
                </PrimaryButton>
                <img
                    className="w-full h-60 rounded-xl"
                    src="https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1"
                    alt="Sunset in the mountains"
                />
            </div>
            <div className="p-4">
                <div className="text-xl mb-2">{item.item_name}</div>
                <div className="font-bold text-xl mb-2">{Currency(item.price)}</div>
            </div>
        </div>
    );
};

export default CardItem;
