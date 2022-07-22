import OrderItem from "./orderItem";

export default class Order{
    private _id: string;
    private _customer_id: string;
    private _items: OrderItem[] = [];
    private _total: number;


    constructor(id: string, customer_id: string, items: OrderItem[]) {
        this._id = id;
        this._customer_id = customer_id;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._customer_id.length === 0) {
            throw new Error("CustomerId is required")
        }
        if (this._items.length === 0) {
            throw new Error("Items are required");
        }
        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0);
    }
}