import { SettingsType } from "@/types/SettingsType";
import Modal from "./Modal";
import { useEffect, useState } from "react";

interface CloseStoreModalProps {
    setting: SettingsType;
}

export const CloseStoreModal = (
    { setting }: CloseStoreModalProps,
) => {
    const [open, setOpen] = useState<boolean>(false);
    const [closeType, setCloseType] = useState<string>("");
    const handleClose = () => {
        setOpen(!open);
    };

    const isOfficeHour = () => {
        const dateNow = new Date();
        let openHourFull = new Date();
        let closeHourFull = new Date();
        const openHour = setting.open_hour.split(":");
        const closeHour = setting.close_hour.split(":");

        openHourFull.setHours(parseInt(openHour[0]));
        openHourFull.setMinutes(parseInt(openHour[1]));
        closeHourFull.setHours(parseInt(closeHour[0]));
        closeHourFull.setMinutes(parseInt(closeHour[1]));

        const nowMoreThanOpenHour = dateNow.getTime() >= openHourFull.getTime();
        const nowLessThanCloseHour = dateNow.getTime() <= closeHourFull.getTime();
        return nowMoreThanOpenHour && nowLessThanCloseHour;
    };

    const isTempClose = () => {
        const dateNow = new Date();
        const temporary_close_until = new Date(setting.temporary_close_until)
            .getTime();
        return dateNow.getTime() <= temporary_close_until;
    };

    useEffect(() => {
        setOpen(false);
        setCloseType("");

        if (isTempClose()) {
            console.log("SEDANG TEMPORARY CLOSE");
            setOpen(true);
            setCloseType("temporary_close");
        } else {
            if (!isOfficeHour()) {
                console.log("DILUAR OFFICE HOUR");
                setOpen(true);
                setCloseType("office_hour");
            }
        }
    });

    return (
        <Modal show={open} onClose={handleClose} maxWidth="md">
            <div>
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Toko Sedang Tutup
                    </h2>
                    {closeType == "office_hour" && (
                        <div className="pt-5">
                            Saat ini sedang berada diluar jam kerja toko, buka lagi pada{" "}
                            <b>{setting.open_hour} - {setting.close_hour}</b>
                        </div>
                    )}
                    {closeType == "temporary_close" && (
                        <div className="pt-5">
                            Saat ini toko sedang tutup, akan buka lagi pada{" "}
                            <b>{setting.temporary_close_until.toString()}</b>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
