import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";

describe('Customer repository test', function () {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async function () {
        await sequelize.close();
    });

    it('should create a customer', async function () {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1", null);
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it('should update a customer', async function () {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1", null);
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        });
    });

    it('should find a customer', async function () {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1", null);
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);
        const customerModel = await CustomerModel.findOne({
            where: {id: customer.id},
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customerResult.id,
            name: customerResult.name,
            active: customerResult.isActive(),
            rewardPoints: customerResult.rewardPoints,
            city: address.city,
            number: address.number,
            street: address.street,
            zipcode: address.zip
        });
    });

    it('should throw an error when customer is not found', function () {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });

    it('should find all customers', async function () {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1", null);
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("456", "Customer 2", null);
        const address2 = new Address("Street2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoints(20);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    });
});