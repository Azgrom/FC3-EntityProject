import Customer from "./customer";
import Address from "./address";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrowError("Id is required");
    });

    it("Should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("Should change name", () => {
        const customer = new Customer("123", "John");

        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer1");
        const address = new Address("St1", 123, "123456", "City");
        customer._address = address;

        customer.activate()

        expect(customer.isActive()).toBe(true);
    });

    it("Should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer1");

            customer.activate()
        }).toThrowError("Address is mandatory to activate a customer");


        // expect(customer.isActive()).toThrowError();
    });

    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer1");

        customer.deactivate()

        expect(customer.isActive()).toBe(false);
    });

})