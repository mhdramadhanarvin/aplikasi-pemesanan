import { ItemType } from "./ItemType";

export interface CartType {
    [productId: string]: ItemType;
}
