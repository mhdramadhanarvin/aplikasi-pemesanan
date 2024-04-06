import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { useEffect, useRef, useState } from "react";
mapboxgl.accessToken =
    "pk.eyJ1IjoiemFuZW15IiwiYSI6ImNsc3J0eXBzMzA3eW4ybm1sZWpsajIzbHUifQ.mEB-n3fUIdgbclKcucRxGA";

interface DropPointEmbedProps {
    dropPoint: any;
}

const DropPointEmbed = (
    { dropPoint }: DropPointEmbedProps,
) => {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [distance, setDistance] = useState<string>("");

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [dropPoint["origin"][0], dropPoint["origin"][1]],
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
            directions.setOrigin(dropPoint["origin"]);
            directions.setDestination(dropPoint["destination"]);
        });
        directions.on("route", (e: any) => {
            setDistance((e.route[0].distance * 0.001).toFixed(2));
        });
    });
    return (
        <>
            <div>
                <div ref={mapContainer} className="h-screen w-full" />
                <span className="absolute top-0 text-center text-2xl font-bold w-full">
                    Jarak : {distance} KM
                </span>
            </div>
        </>
    );
};

export default DropPointEmbed;
