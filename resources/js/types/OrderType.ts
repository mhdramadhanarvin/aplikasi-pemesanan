import { DropPointType } from "./DropPointType";
import { ItemType } from "./ItemType";

export enum OrderStatus {
    WAITING_PAYMENT = "waiting_payment",
    ON_PROGRESS = "on_progress",
    DELIVERY = "delivery",
    DONE = "done",
    CANCELED = "canceled",
    EXPIRED = "expired",
}

export interface ItemOrder {
    id: number;
    product: ItemType;
    quantity: number;
    price: number;
    total_price: number;
}

export interface AddressOrder extends DropPointType {
    id: number;
}

export interface OrderType {
    id: number;
    user_id: number;
    total_price: number;
    payment_expired_at: string;
    pay_at: string;
    proof_of_payment: string;
    status: OrderStatus;
    format_created_at: string;
    item_orders_count: number;
    item_orders: ItemOrder[];
    address_order: AddressOrder;
}

