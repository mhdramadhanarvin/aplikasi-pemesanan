const idr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
});

const Currency = (amount: number) => {
    return idr.format(amount);
};

export default Currency;
