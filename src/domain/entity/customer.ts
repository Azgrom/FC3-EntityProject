import Address from "./address";
import EventDispatcherInterface from "../event/@shared/event-dispatcher.interface";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import CustomerChangeAddressEvent from "../event/customer/customer-change-address.event";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints: number = 0;
    private _customerEvents?: EventDispatcherInterface;

    private constructor(id: string, name: string, customerEvent: EventDispatcherInterface) {
        this._id = id;
        this._name = name;
        this.validate();
        this._customerEvents = customerEvent;
        if (customerEvent !== null) {
            this._customerEvents.notify(new CustomerCreatedEvent({
                id: id,
                name: name,
            }));
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    static create(id: string, name: string): Customer {
        return new Customer(id, name, null);
    }

    static createAndNotify(id: string, name: string, creationEvent: EventDispatcherInterface): Customer {
        return new Customer(id, name, creationEvent);
    }

    validate() {
        if (this._name.length === 0){
            throw new Error("Name is required");
        }
        if (this._id.length ===0) {
            throw new Error("Id is required")
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    isActive(): boolean {
        return this._active;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points
    }

    changeAddress(address: Address) {
        this._address = address;
        if (this._customerEvents !== null) {
            this._customerEvents.notify(new CustomerChangeAddressEvent({
                id: this.id,
                name: this.name,
                address: this.address
            }))
        }
    }

    assignEventDispatcher(eventDispatcher: EventDispatcherInterface) {
        this._customerEvents = eventDispatcher;
    }
}