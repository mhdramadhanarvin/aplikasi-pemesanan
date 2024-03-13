import Modal from "@/Components/Modal";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { useEffect, useRef, useState } from "react";
import SecondaryButton from "../SecondaryButton";

mapboxgl.accessToken =
    "pk.eyJ1IjoiemFuZW15IiwiYSI6ImNsc3J0eXBzMzA3eW4ybm1sZWpsajIzbHUifQ.mEB-n3fUIdgbclKcucRxGA";

interface DropPointModalProps {
    origin: number[];
    destination: number[];
    handleClose: (open: boolean) => void;
}

export const DropPointModal = (
    { origin, destination, handleClose }: DropPointModalProps,
) => {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [distance, setDistance] = useState<string>("");

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [origin[0], origin[1]],
            zoom: 12,
            minZoom: 11,
        });

        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: "metric",
            profile: "mapbox/driving",
            instructions: {
                showWaypointInstructions: false,
            },
            zoom: 12,
            placeholderDestination: "Masukkan alamat pengantaran",
            language: "id",
            controls: {
                inputs: false,
                profileSwitcher: false,
                instructions: false,
            },
            interactive: false,
        });

        const geoControll = new GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserHeading: true,
        });

        // Integrates directions control with map
        map.current.addControl(geoControll);
        map.current.addControl(directions, "top-left");
        map.current.on("load", () => {
            geoControll.trigger();
            directions.setOrigin(origin);
            directions.setDestination(destination);
        });
        directions.on("route", (e: any) => {
            //     // setOrigin(directions.getOrigin().geometry.coordinates);
            //     setDestination(directions.getDestination().geometry.coordinates);
            setDistance((e.route[0].distance * 0.001).toFixed(2));
        });
    });

    return (
        <Modal show={true} onClose={handleClose} maxWidth="2xl">
            <div>
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Drop Point Pengantaran
                    </h2>
                </div>

                <div className="px-7 py-3 text-center">
                    <div ref={mapContainer} className="h-[600px] w-full" />
                    <span className="text-2xl">Jarak : {distance} KM</span>
                </div>
                <div className="flex justify-center p-5">
                    <SecondaryButton onClick={() => handleClose(false)}>
                        TUTUP
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};
