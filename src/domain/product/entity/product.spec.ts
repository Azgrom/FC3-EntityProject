import Product from "./product";

describe("Customer unit tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            const product = new Product("", "Product1", 100);
        }).toThrowError("Id is required");
    });

    it("Should throw error when name is empty", () => {
        expect(() => {
            const product = new Product("123", "", 100);
        }).toThrowError("Name is required");
    });

    it("Should throw error when price is negative", () => {
        expect(() => {
            const product = new Product("123", "P1", -1);
        }).toThrowError("Price must be greater than zero");
    });

    it("Should change name", () => {
        const product = new Product("123", "P1", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    it("Should change price", () => {
        const product = new Product("123", "P1", 100);
        product.changePrice(20);
        expect(product.price).toBe(20);
    });

})