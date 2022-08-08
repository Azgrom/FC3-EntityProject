import Customer from "./customer";
import Address from "./address";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John", null);
        }).toThrowError("Id is required");
    });

    it("Should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "", null);
        }).toThrowError("Name is required");
    });

    it("Should change name", () => {
        const customer = new Customer("123", "John", null);

        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer1", null);
        const address = new Address("St1", 123, "123456", "City");
        customer._address = address;

        customer.activate()

        expect(customer.isActive()).toBe(true);
    });

    it("Should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer1", null);

            customer.activate()
        }).toThrowError("Address is mandatory to activate a customer");


        // expect(customer.isActive()).toThrowError();
    });

    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer1", null);

        customer.deactivate()

        expect(customer.isActive()).toBe(false);
    });

    it("Should add reward points", () => {
        const customer = new Customer("1", "Customer1", null);

        expect(customer.rewardPoints).toBe(0);
        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20);
    });

})