import Modal from "@/Components/Modal";
import SecondaryButton from "../SecondaryButton";
import { OrderType } from "@/types/OrderType";
import PrimaryButton from "../PrimaryButton";
import { useForm } from "@inertiajs/react";

interface CompleteOrderModalProps {
    open: boolean;
    handleClose: (close: boolean) => void;
    order: OrderType;
}

export const CompleteOrderModal = (
    { open, handleClose, order }: CompleteOrderModalProps,
) => {
    const handleCloseModal = () => {
        handleClose(!open);
    };
    const { post } = useForm({});
    const handleSubmit = () => {
        post(route("order.complete", order.id), {
            onSuccess: (data) => console.log(data),
        }); // Directly pass FormData object
    };

    return (
        <Modal show={true} onClose={handleClose} maxWidth="md">
            <div>
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Konfirmasi Selesaikan Pesanan
                    </h2>
                    <div className="pt-5">Yakin ingin menyelesaikan pesanan ini ?</div>
                </div>
                <div className="flex justify-center p-5 gap-2">
                    <PrimaryButton onClick={handleSubmit}>
                        YA
                    </PrimaryButton>
                    <SecondaryButton onClick={handleCloseModal}>
                        TIDAK
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};
