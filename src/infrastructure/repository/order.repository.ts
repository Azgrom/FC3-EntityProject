import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import Order from "../../domain/entity/order";
import OrderItemModel from "../db/sequelize/model/order-item.model";

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customer_id,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity,
            })),
        },
            {
                include: [{model: OrderItemModel}]
    },);
    }

    async find(id: string): Promise<Customer> {
        let customerModel;

        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }

        let customer = new Customer(
            customerModel.id,
            customerModel.name,
        );
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        );
        customer.changeAddress(address);
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customers = customerModels.map((customerModels) => {
            let customer = new Customer(customerModels.id, customerModels.name);
            customer.addRewardPoints(customerModels.rewardPoints);
            const address = new Address(
                customerModels.street,
                customerModels.number,
                customerModels.zipcode,
                customerModels.city
            );
            customer.changeAddress(address);
            if (customerModels.active) {
                customer.activate();
            }

            return customer;
        })

        return customers;
    }

    findByName(name: string) {
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
                name: entity.name,
                number: entity.address.number
            },
            { where: { id: entity.id },  }
        );
    }
}