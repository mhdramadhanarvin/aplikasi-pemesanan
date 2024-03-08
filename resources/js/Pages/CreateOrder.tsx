import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useState } from "react";
import CardItem from "@/Components/CardItem";
import { ItemType } from "@/types/ItemType";
import CheckoutButton from "@/Components/Checkout/CheckoutButton";

export default function CreateOrder({ auth }: PageProps) {
    const [rowData] = useState<ItemType[]>([
        {
            id: 1,
            item_name: "Item 1",
            thumbnail:
                "https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1",
            price: 10500,
            quantity: 100,
        },
        {
            id: 2,
            item_name: "Item 2",
            thumbnail:
                "https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1",
            price: 10500,
            quantity: 100,
        },
        {
            id: 3,
            item_name: "Item 3",
            thumbnail:
                "https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1",
            price: 10500,
            quantity: 100,
        },
        {
            id: 4,
            item_name: "Item 4",
            thumbnail:
                "https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1",
            price: 10500,
            quantity: 100,
        },
        {
            id: 5,
            item_name: "Item 5",
            thumbnail:
                "https://i0.wp.com/resepkoki.id/wp-content/uploads/2020/10/Resep-Bakso-Bakar-Pedas-Manis-1.jpg?fit=438%2C496&ssl=1",
            price: 10500,
            quantity: 100,
        },
    ]);

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <div className="block w-screen py-3">
                            <h1 className="text-2xl text-center lg:text-left font-extrabold">
                                Menu Spesial Untuk Kamu
                            </h1>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {rowData.map((data: ItemType, key: number) => (
                                <CardItem key={key} item={data} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutButton />
        </AuthenticatedLayout>
    );
}
