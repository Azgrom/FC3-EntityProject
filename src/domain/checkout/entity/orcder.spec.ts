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
        const item = new OrderItem("1i", "Item 1", 100, 'p1', 2);
        const item2 = new OrderItem("1i", "Item 1", 200, "p2", 3);

        const order = new Order("o1", "c1", [item]);
        const total = order.total();
        const order2 = new Order("o2", "c2", [item, item2]);
        const total2 = order2.total();

        expect(total).toBe(200);
        expect(total2).toBe(800)
    });

    it("Should throw error if item qtd is less or equal than zero", () => {

        expect(() => {
            const item = new OrderItem("1i", "Item 1", 100, 'p1', 0);
            const order = new Order("o1", "c1", [item]);
        }).toThrowError("Quantity must be greater than zero")

    });

})