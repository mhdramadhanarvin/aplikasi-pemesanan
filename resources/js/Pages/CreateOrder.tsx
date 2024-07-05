import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import CardItem from "@/Components/CardItem";
import CheckoutButton from "@/Components/Checkout/CheckoutButton";
import { DropPoint } from "@/Components/DropPoint/DropPoint";
import { CloseStoreModal } from "@/Components/CloseStoreModal";
import { MinimumOrderModal } from "@/Components/MinimumOrderModal";
import { PageProps } from "@/types";
import { DropPointType } from "@/types/DropPointType";
import { SettingsType } from "@/types/SettingsType";
import { ItemType } from "@/types/ItemType";
import "../../css/create-order.scss";

export default function CreateOrder(
    { auth, products }: PageProps<{ products: ItemType[] }>,
) {
    const [step, setSteps] = useLocalStorageState<number>("stepCreateOrder", {
        defaultValue: 1,
    });
    const [storeSetting, setStoreSetting] = useState<SettingsType>({
        open_hour: "",
        close_hour: "",
        temporary_close_until: new Date(),
        is_open: true,
    });
    const [dropPoint, setDropPoint] = useLocalStorageState<DropPointType>(
        "dropPointDetail",
        {
            defaultValue: {
                name: "",
                phone_number: "",
                address: "",
                origin: [0, 0],
                destination: [0, 0],
                fee_shipping: 0,
                duration: 0,
            },
        },
    );

    useEffect(() => {
        const fetchData = async () => {
            return await fetch("/settings")
                .then((res) => res.json())
                .then((data) => {
                    setStoreSetting(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchData();

        router.on("start", (event) => {
            if (event.detail.visit?.url.pathname === "/logout") {
                setDropPoint({
                    name: "",
                    phone_number: "",
                    address: "",
                    origin: [0, 0],
                    destination: [0, 0],
                    fee_shipping: 0,
                    duration: 0,
                });
                setSteps(1);
            }
        });
    }, [dropPoint, step]);

    return (
        <>
            <Head title="Buat Pesanan" />
            <CloseStoreModal setting={storeSetting} />
            <DropPoint
                user={auth.user}
                step={step}
                setStep={setSteps}
                dropPoint={dropPoint}
                setDropPoint={setDropPoint}
            />

            {step == 2 && (
                <>
                    <MinimumOrderModal user_id={auth.user.id}/>
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
                </>
            )}

            {step == 2 && (
                <CheckoutButton
                    show={step == 2}
                    dropPoint={dropPoint}
                    setDropPoint={setDropPoint}
                    setStep={setSteps}
                />
            )}
        </>
    );
}

CreateOrder.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        title="Buat Pesanan"
        children={page}
    />
);
