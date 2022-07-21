export default class Product {
    _id:string;
    _name:string;
    _price:number;


    constructor(id: string, name: string, price: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this.validate();
    }

    private validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0 || this._name === " ") {
            throw new Error("Name is required");
        }
        if (this._price < 0) {
            throw new Error("Price must be greater than zero");
        }

        return true;
    }

    changeName(newName: string) {
        this._name = newName;
    }
}