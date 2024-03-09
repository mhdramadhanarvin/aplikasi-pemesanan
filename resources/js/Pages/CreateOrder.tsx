import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useEffect, useRef, useState } from "react";
import CardItem from "@/Components/CardItem";
import { ItemType } from "@/types/ItemType";
import CheckoutButton from "@/Components/Checkout/CheckoutButton";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "../../css/create-order.scss"

mapboxgl.accessToken =
    "pk.eyJ1IjoiemFuZW15IiwiYSI6ImNsc3J0eXBzMzA3eW4ybm1sZWpsajIzbHUifQ.mEB-n3fUIdgbclKcucRxGA";

export default function CreateOrder(
    { auth, products }: PageProps<{ products: ItemType[] }>,
) {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<string>("98.7057");
    const [lat, setLat] = useState<string>("3.5763");
    const [zoom] = useState<number>(12);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [parseFloat(lng), parseFloat(lat)],
            zoom: zoom,
            minZoom: 11,
        });

        // console.log([parseFloat(lng), parseInt(lat)])

        // map.current.on("move", () => {
        //     setLng(map.current.getCenter().lng.toFixed(4));
        //     setLat(map.current.getCenter().lat.toFixed(4));
        //     setZoom(map.current.getZoom().toFixed(2));
        // });

        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: "metric",
            profile: "mapbox/driving",
            instructions: false,
            zoom,
        });

        const geoControll = new GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true,
        });

        // Integrates directions control with map
        map.current.addControl(geoControll);
        map.current.addControl(directions, "top-left");
        map.current.on("load", () => {
            geoControll.trigger();
            directions.setOrigin([lng, lat]); // can be address in form setOrigin("12, Elm Street, NY")
        });
        directions.on('route', (e:any) => {
            console.log(e.route[0].distance)
        })

        // const markerA = new mapboxgl.Marker({
        //     color: "#D04848",
        // }).setLngLat([98.6629, 3.5847])
        //     .addTo(map.current);
        //
        //
        // const markerB = new mapboxgl.Marker({
        //     color: "#0B60B0",
        //     draggable: true,
        // }).setLngLat([98.6529, 3.5847])
        //     .addTo(map.current);

        // markerB.on("drag", () => {
        //     setTimeout(() => {
        //         setLat(markerB.getLngLat().lat.toFixed(4))
        //         setLng(markerB.getLngLat().lng.toFixed(4))
        //     }, 800);
        // });
    });

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

            <div className="pt-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <div className="block w-screen py-3">
                            <h1 className="text-2xl text-center lg:text-left font-extrabold">
                                Alamat Pengantaran
                            </h1>
                        </div>
                        <div>
                            <div className="sidebar">
                                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                            </div>
                            <div ref={mapContainer} className="h-[600px]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
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

            <CheckoutButton />
        </AuthenticatedLayout>
    );
}
