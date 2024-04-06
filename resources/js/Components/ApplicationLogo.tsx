import { HTMLAttributes } from "react";

export default function ApplicationLogo(
    { className = "", ...props }: HTMLAttributes<HTMLDivElement>,
) {
    return (
        <div
            {...props}
            className={
                `text-3xl block p-5 h-full flex justify-center` + ` ` + className
            }
        >
            <h2>Bakso Bakar Asoy Geboy</h2>
        </div>
    );
}
