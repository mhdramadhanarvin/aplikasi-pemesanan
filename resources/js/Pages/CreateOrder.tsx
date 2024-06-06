import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useEffect, useState } from "react";
import CardItem from "@/Components/CardItem";
import { ItemType } from "@/types/ItemType";
import CheckoutButton from "@/Components/Checkout/CheckoutButton";
import { DropPoint } from "@/Components/DropPoint/DropPoint";
import { DropPointType } from "@/types/DropPointType";
import { SettingsType } from "@/types/SettingsType";
import "../../css/create-order.scss";
import { CloseStoreModal } from "@/Components/CloseStoreModal";

export default function CreateOrder(
    { auth, products }: PageProps<{ products: ItemType[] }>,
) {
    const [step, setSteps] = useState<number>(1);
    const [storeSetting, setStoreSetting] = useState<SettingsType>({
        open_hour: "",
        close_hour: "",
        temporary_close_until: new Date(),
        is_open: true,
    });
    const [dropPoint, setDropPoint] = useState<DropPointType>({
        name: "",
        phone_number: "",
        address: "",
        origin: [0, 0],
        destination: [0, 0],
        fee_shipping: 0,
        duration: 0,
    });

    const fetchData = async () => {
        return await fetch("/settings")
            .then((res) => res.json())
            .then((json) => {
                return json;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        // fetchData();
        (async () => {
            const getSetting = await fetchData();
            setStoreSetting(getSetting);
        })();
    }, [storeSetting]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Pesanan
                </h2>
            }
        >
            <Head title="Buat Pesanan" />

            <CloseStoreModal setting={storeSetting}/>

            <DropPoint
                user={auth.user}
                step={step}
                setStep={setSteps}
                dropPoint={dropPoint}
                setDropPoint={setDropPoint}
            />

            {step == 2 && (
                <div className="py-12" hidden={step != 2}>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                            <div className="block w-screen py-3">
                                <h1 className="text-2xl text-center lg:text-left font-extrabold">
                                    Menu Spesial Untuk Kamu
                                </h1>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                {products.map((data: ItemType, key: number) => (
                                    <CardItem key={key} item={data} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step == 2 && <CheckoutButton show={step == 2} dropPoint={dropPoint} />}
        </AuthenticatedLayout>
    );
}
