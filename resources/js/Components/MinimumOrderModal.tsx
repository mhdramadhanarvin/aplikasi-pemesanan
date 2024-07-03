import useLocalStorageState from "use-local-storage-state";
import Modal from "./Modal";
import PrimaryButton from "./PrimaryButton";

export const MinimumOrderModal = () => {
    const [open, setOpen] = useLocalStorageState<boolean>("infoMinimumOrder", {
        defaultValue: true,
    });
    const handleClose = () => {
        setOpen(!open);
    };

    return (
        <Modal show={open} onClose={handleClose} maxWidth="md">
            <div>
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Informasi
                    </h2>
                    <div className="pt-3">
                        Minimum pemesanan adalah{" "}
                        <b>Rp. 10.000</b>, silahkan lakukan pemesanan diatas{" "}
                        <b>Rp. 10.000</b> untuk dapat melanjutkan.
                    </div>
                    <div className="flex justify-center pt-5">
                        <PrimaryButton onClick={handleClose}>TUTUP</PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
