const idr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
});

const Currency = (amount: number) => {
    return idr.format(amount);
};

const addAmount = (
    amount1: number,
    amount2: number,
    currency: boolean = true,
) => {
    return currency ? Currency(amount1 + amount2) : amount1 + amount2;
};

const deductAmount = (
    amount1: number,
    amount2: number,
    currency: boolean = true,
) => {
    return currency ? Currency(amount1 - amount2) : amount1 - amount2;
};

export { addAmount, Currency, deductAmount };
