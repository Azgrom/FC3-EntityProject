import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/orderItem";
import OrderRepository from "./order.repository";

describe('Order repository test', function () {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync()

        const customer = Customer.create("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);
    })

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async function () {
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [orderItem])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customerId: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.unitPrice,
                    productId: orderItem.productId,
                    quantity: orderItem.quantity,
                    orderId: "123"
                },
            ],
        });
    });

    it('should update an order', async function () {
        const product1 = new Product("123", "Product 1", 10);
        const productRepository = new ProductRepository();
        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        const order = new Order("123", "123", [orderItem1]);
        const orderRepository = new OrderRepository();

        const product2 = new Product("321", "Product 2", 30);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 5);

        await productRepository.create(product1);
        await productRepository.create(product2);
        await orderRepository.create(order);
        order.updateItems([orderItem2]);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ where: { id: "123" }, include: ["items"] });
        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customerId: "123",
            total: order.total(),
            items:  [
                {
                    id: orderItem2.id,
                    productId: orderItem2.productId,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    orderId: order.id
                },
            ]
        });
    });

    it('should find a order', async function () {
        const product = new Product("123", "Product 1", 10);
        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [orderItem]);
        const productRepository = new ProductRepository();
        const orderRepository = new OrderRepository();

        await productRepository.create(product);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
        const orderResult = await orderRepository.find(order.id);
        let items = orderResult.items.map((item) =>
            new OrderItem(
                item.id,
                item.name,
                item.unitPrice,
                item.productId,
                item.quantity,
            )
        );
        expect(orderModel.toJSON()).toStrictEqual({
            id: orderResult.id,
            customerId: orderResult.customer_id,
            total: orderResult.total(),
            items: [
                {
                    id: orderResult.items[0].id,
                    price: orderResult.items[0].unitPrice,
                    name: orderResult.items[0].name,
                    productId: orderResult.items[0].productId,
                    quantity: orderResult.items[0].quantity,
                    orderId: orderResult.id
                }
            ],
        });
    });

    it('should find all orders', async function () {
        const product = new Product("123", "Product 1", 10);
        const orderItem1 = new OrderItem("1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 3);
        const order1 = new Order("123", "123", [orderItem1]);
        const order2 = new Order("321", "123", [orderItem2]);

        const productRepository = new ProductRepository();
        await productRepository.create(product);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await OrderModel.findAll({ include: ["items"] });
        const ordersResult = await orderRepository.findAll();
        expect(orders).toHaveLength(2);
        expect(orders[0].toJSON()).toStrictEqual(
            {
                id: order1.id,
                customerId: order1.customer_id,
                total: order1.total(),
                items: [
                    {
                        id: ordersResult[0].items[0].id,
                        price: ordersResult[0].items[0].unitPrice,
                        name: ordersResult[0].items[0].name,
                        productId: ordersResult[0].items[0].productId,
                        quantity: ordersResult[0].items[0].quantity,
                        orderId: ordersResult[0].id
                    }
                ]
            }
        );
        expect(orders[1].toJSON()).toStrictEqual(
            {
            id: order2.id,
            customerId: order2.customer_id,
            total: order2.total(),
            items: [
                {
                    id: ordersResult[1].items[0].id,
                    price: ordersResult[1].items[0].unitPrice,
                    name: ordersResult[1].items[0].name,
                    productId: ordersResult[1].items[0].productId,
                    quantity: ordersResult[1].items[0].quantity,
                    orderId: ordersResult[1].id
                }
            ]
        }
        );
    });
});