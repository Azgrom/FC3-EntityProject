import Order from "./order";
import OrderItem from "./orderItem";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("Should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("Should throw error when item list is empty", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    });

    it("Should calculate total", () => {
        const item = new OrderItem("1i", "Item 1", 100);
        const order = new Order("o1", "c1", [item]);

        const total = order.total();

        expect(total).toBe(100);
    });

})