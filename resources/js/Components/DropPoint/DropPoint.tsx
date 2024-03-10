import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { DropPointType } from "@/types/DropPointType";

mapboxgl.accessToken =
    "pk.eyJ1IjoiemFuZW15IiwiYSI6ImNsc3J0eXBzMzA3eW4ybm1sZWpsajIzbHUifQ.mEB-n3fUIdgbclKcucRxGA";

interface DropPointProps {
    setStep: (step: number) => void;
    step: number;
    user: {
        name: string;
    };
    dropPoint: DropPointType;
    setDropPoint: (dropPoint: DropPointType) => void;
}

export const DropPoint = (
    { user, setStep, step, dropPoint, setDropPoint }: DropPointProps,
) => {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            name: user.name,
            address: "",
            phone_number: "",
            origin: "",
        });

    // anthing about map
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [showDropPoint, setShowDropPoint] = useState<boolean>(false);
    const [origin, setOrigin] = useState<number[]>([98.705595, 3.576609]);
    const [destination, setDestination] = useState<number[]>([0, 0]);
    const [distance, setDistance] = useState<number>(0);
    const [valid, setValid] = useState<boolean>(false);

    useEffect(() => {
        if (showDropPoint) {
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
                    profileSwitcher: false,
                    instructions: false,
                },
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
                directions.setOrigin(origin); // can be address in form setOrigin("12, Elm Street, NY")
            });
            directions.on("route", (e: any) => {
                // setOrigin(directions.getOrigin().geometry.coordinates);
                setDestination(directions.getDestination().geometry.coordinates);
                setDistance(e.route[0].distance);
            });
        }
    });

    const validateDropPoint = () => {
        if (data.name == "") {
            setError("name", "Masukkan nama lengkap");
            setValid(false);
        } else if (data.address == "") {
            setError("address", "Masukkan alamat lengkap");
            setValid(false);
        } else if (data.phone_number == "") {
            setError("phone_number", "Masukkan nomor HP atau Whatsapp");
            setValid(false);
        } else {
            clearErrors("name", "address", "phone_number");
            setShowDropPoint(!showDropPoint);
            setValid(true);
        }
    };

    const saveDropPoint = () => {
        if (valid) {
            setDropPoint({
                name: data.name,
                phone_number: data.phone_number,
                address: data.address,
                origin,
                destination,
                fee_shipping: distance > 5000 ? 15000 : 0,
            });
            setStep(2);
        }
    };

    return (
        <>
            <div className="pt-12" hidden={step != 1}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <div className="block w-screen py-3">
                            <h1 className="text-2xl text-center lg:text-left font-extrabold">
                                Alamat Pengantaran
                            </h1>
                        </div>

                        <div className="mb-3">
                            <InputLabel htmlFor="name" value="Nama Lengkap" />

                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Masukkan nama lengkap"
                                className="mt-1 block w-1/2"
                                isFocused={true}
                                onChange={(e) => setData("name", e.target.value)}
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mb-3">
                            <InputLabel htmlFor="phone_number" value="Nomor HP/Whatsapp" />

                            <TextInput
                                id="phone_number"
                                type="text"
                                name="phone_number"
                                value={data.phone_number}
                                placeholder="+628"
                                className="mt-1 block w-1/2"
                                isFocused={true}
                                onChange={(e) => setData("phone_number", e.target.value)}
                            />

                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>
                        <div className="mb-3">
                            <InputLabel htmlFor="address" value="Alamat Lengkap" />

                            <TextInput
                                id="address"
                                type="text"
                                name="address"
                                value={data.address}
                                placeholder="Masukkan alamat lengkap"
                                className="mt-1 block w-1/2"
                                isFocused={true}
                                onChange={(e) => setData("address", e.target.value)}
                            />

                            <InputError message={errors.address} className="mt-2" />
                            <InputError message={errors.origin} className="mt-2" />
                        </div>
                        <PrimaryButton className="my-2" onClick={validateDropPoint}>
                            Pilih Titik Pengantaran
                        </PrimaryButton>

                        <div hidden={!showDropPoint}>
                            <div ref={mapContainer} className="h-[600px] w-full" />
                            <div className="relative w-full text-center">
                                Klik titik untuk mengatur pengantaran
                            </div>

                            <PrimaryButton
                                className="my-2"
                                onClick={saveDropPoint}
                            >
                                SIMPAN
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2 mt-5" hidden={step != 2}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5">
                        <div className="block w-screen py-3">
                            <h1 className="text-2xl text-center lg:text-left font-extrabold">
                                Alamat Pengantaran
                            </h1>
                        </div>
                        <div className="">
                            <InputLabel value="">
                                <span className="text-lg">Nama Lengkap : {data.name}</span>
                            </InputLabel>
                        </div>
                        <div className="">
                            <InputLabel value="">
                                <span className="text-lg">
                                    Nomor HP atau Whatsapp : {data.phone_number}
                                </span>
                            </InputLabel>
                        </div>
                        <div className="">
                            <InputLabel value="">
                                <span className="text-lg">
                                    Alamat Lengkap : {data.address}
                                </span>
                            </InputLabel>
                        </div>
                        <div className="my-2">
                            <PrimaryButton onClick={() => setStep(1)}>
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Ubah Alamat
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
