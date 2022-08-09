import OrderModel from "../db/sequelize/model/order.model";
import Order from "../../domain/checkout/entity/order";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/checkout/order-repository.interface";
import OrderItem from "../../domain/checkout/entity/orderItem";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customer_id,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.unitPrice,
                productId: item.productId,
                quantity: item.quantity,
            })),
        },
            {
                include: [{model: OrderItemModel}]
            },
            );
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne(
                {
                    where:
                        { id: id },
                    include: ["items"],
                    rejectOnEmpty: true
                });
        } catch (error) {
            throw new Error("Order not found");
        }

        const orderItems = orderModel.items.map((item) => {
            return new OrderItem(
                item.id,
                item.name,
                item.price,
                item.productId,
                item.quantity
            )
        });

        return new Order(
            orderModel.id,
            orderModel.customerId,
            orderItems
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ["items"], });

        const orders = orderModels.map((o) => {
            const orderItems = o.items.map((item) => {
                let price = item.price;
                let quantity = item.quantity;
                return new OrderItem(item.id, item.name, price, item.productId, quantity);
            })
            return new Order(o.id, o.customerId, orderItems);
        })

        return orders;
    }

    async update(entity: Order): Promise<void> {
        await OrderItemModel.destroy({
            where: { orderId: entity.id }
        });

        let items = entity.items;

        items.map(async (item) => {
            await OrderItemModel.create({
                id: item.id,
                orderId: entity.id,
                productId: item.productId,
                price: item.price,
                name: item.name,
                quantity: item.quantity
            })
        });

        await OrderModel.update({
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    price: item.unitPrice,
                    name: item.name,
                    quantity: item.quantity
                })),
            },
            {
                where: { id: entity.id },
            }
        );
    }
}