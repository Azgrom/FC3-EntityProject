import Address from "./entity/address";
import OrderItem from "./entity/orderItem";
import Customer from "./entity/customer";
import Order from "./entity/order";

let customer = new Customer("123", "WW");
const address = new Address("Rua tres", 2, "123456", "SP");

customer._address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10);
const item2 = new OrderItem("2", "Item 2", 15);

const order = new Order("1", "123", [item1, item2]);