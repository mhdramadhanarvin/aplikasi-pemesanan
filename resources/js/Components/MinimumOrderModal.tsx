import useLocalStorageState from "use-local-storage-state";
import Modal from "./Modal";
import PrimaryButton from "./PrimaryButton";

interface showModal {
    status: boolean,
    user_id: string
}

export const MinimumOrderModal = ({ user_id }) => {
    const [open, setOpen] = useLocalStorageState<showModal>("infoMinimumOrder", {
        defaultValue: {
            status: true,
            user_id: ""
        },
    });
    const handleClose = () => {
        setOpen({
            status: !open.status,
            user_id: user_id
        });
    };

    return (
        <Modal show={open.status || open.user_id != user_id} onClose={handleClose} maxWidth="md">
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
