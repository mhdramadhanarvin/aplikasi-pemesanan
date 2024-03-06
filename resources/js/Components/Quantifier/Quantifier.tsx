import { FunctionComponent, useEffect, useState } from "react";

import classes from "./quantifier.module.scss";

export type Operation = "decrease" | "increase";

interface Props {
    removeProductCallback: (id: number) => void;
    handleUpdateQuantity: (id: number, operation: Operation) => void;
    id: number;
    initialQuantity: number;
}

export const Quantifier: FunctionComponent<Props> = (
    { removeProductCallback, handleUpdateQuantity, id, initialQuantity },
) => {
    const [value, setValue] = useState<number>(initialQuantity);

    const reduce = (): void => {
        handleUpdateQuantity(id, "decrease");

        setValue((prevState) => {
            const updatedValue = prevState - 1;
            if (updatedValue === 0) {
                removeProductCallback(id);
            }
            return updatedValue;
        });
    };

    const increase = (): void => {
        handleUpdateQuantity(id, "increase");
        setValue((prevState) => prevState + 1);
    };

    return (
        <div className={classes.quantifier}>
            <input
                type="button"
                value="-"
                className="bg-gray-800 text-white rounded-full w-16"
                onClick={reduce}
            />
            <input
                type="number"
                step="1"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="text-xl"
                readOnly={true}
            />
            <input
                type="button"
                value="+"
                className="bg-gray-800 text-white rounded-full w-16"
                onClick={increase}
            />
        </div>
    );
};
