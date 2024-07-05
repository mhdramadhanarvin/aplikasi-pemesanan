import { Currency } from "@/Common/Currency";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import { OrderType } from "@/types/OrderType";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import CountdownTimer from "../Countdown/Countdown";

interface PaymentModalProps {
    open: boolean;
    handleClose: (close: boolean) => void;
    order: OrderType;
    totalPrice: number;
}

interface FormData {
    proof_of_payment: File | null;
}

export const PaymentModal = (
    { open, handleClose, order, totalPrice }: PaymentModalProps,
) => {
    const { setData, post, errors, clearErrors, progress } = useForm<
        FormData
    >({
        proof_of_payment: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setData("proof_of_payment", file);
    };

    const handleCloseModal = () => {
        setData({ proof_of_payment: null });
        clearErrors("proof_of_payment");
        handleClose(!open);
    };

    const handleSubmit = () => {
        post(route("order.payment", order.id), {
            onSuccess: () => handleCloseModal(),
        }); // Directly pass FormData object
    };

    const formatDate = (date:string): string => {
        const fullDate = new Date(date).toLocaleString('id-ID')
        const replaceDot = fullDate.replace('.', ':')
        return replaceDot.replace(',' , '')
    }

    return (
        <Modal show={open} onClose={() => { }} maxWidth="lg">
            <div className="px-7 py-5">
                <div className="pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Pembayaran
                    </h2>
                </div>
                <div className="">
                </div>
                <div className="pt-1">
                    <div className="grid grid-cols-6 text-lg font-bold">
                        <div className="col-span-3">
                            <div className="">
                                Total Pembayaran
                            </div>
                        </div>
                        <div className="">{Currency(totalPrice)}</div>
                    </div>
                </div>
                <div className="">
                    <div className="py-2">
                        <p className="text-lg text-gray-900">
                            Silahkan lakukan pembayaran dibawah ini sebelum
                            <span className="font-bold ml-1">{formatDate(order.payment_expired_at)}</span>
                        </p>

                        <div className="text-center w-full text-3xl p-3">
                            <CountdownTimer
                                targetDate={order.payment_expired_at}
                                expiredText="Pembayaran Kadaluarsa!!!"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-7">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Nama E-Wallet
                            </div>
                        </div>
                        <div className="col-span-4 text-lg">DANA</div>
                    </div>
                    <div className="grid grid-cols-7">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Nomor E-Wallet
                            </div>
                        </div>
                        <div className="text-lg col-span-4">0813 6860 0828</div>
                    </div>
                    <div className="grid grid-cols-7">
                        <div className="col-span-3">
                            <div className="text-lg">
                                Nama Akun
                            </div>
                        </div>
                        <div className="text-lg col-span-4">Bakso Bakar Asoy Geboy</div>
                    </div>
                </div>
                <div className="py-4">
                    <label className="block font-medium text-lg text-gray-700">
                        Upload Bukti Pembayaran
                    </label>
                    <TextInput
                        id="file"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        required={true}
                        className="w-full"
                    />
                    <InputError message={errors.proof_of_payment} className="mt-2" />
                    {progress && (
                        <progress value={progress.percentage} max="100">
                            {progress.percentage}%
                        </progress>
                    )}
                </div>
                <div className="flex justify-center pt-5">
                    <PrimaryButton onClick={handleSubmit}>
                        SUDAH BAYAR
                    </PrimaryButton>
                    <SecondaryButton className="mx-2" onClick={handleCloseModal}>
                        NANTI
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};
