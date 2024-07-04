import { HTMLAttributes } from "react";

export default function Label(
    { className = "", children, ...props }: HTMLAttributes<HTMLDivElement>,
) {
    return (
        <div
            {...props}
            className={
                `text-sm block h-full` + ` ` + className
            }
        >
            <label>{children}</label>
        </div>
    );
}
