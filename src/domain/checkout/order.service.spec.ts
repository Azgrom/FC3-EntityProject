import OrderItem from "./entity/orderItem";
import Order from "./entity/order";
import OrderService from "./order.service";
import Customer from "../customer/entity/customer";

describe("Order service unit tests", () => {
    it('should place an order', function () {
        const customer = new Customer("c1", "Customer 1", null);
        const item1 = new OrderItem("i1", "Item 1", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it('should get total of all orders', function () {
        const orderItem1 = new OrderItem("1", "item1", 100, "p1", 1);
        const orderItem2 = new OrderItem("2", "item2", 200, "p2", 2);

        const order1 = new Order("o1", "c1", [orderItem1]);
        const order2 = new Order("o2", "c1", [orderItem2]);
        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    });
});