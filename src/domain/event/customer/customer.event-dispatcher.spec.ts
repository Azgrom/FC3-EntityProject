import EnviaConsoleLog1Handler from "./envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./envia-console-log2.handler";
import CustomerCreatedEvent from "./customer-created.event";
import {EventDispatcher} from "../@shared/event.dispatcher";
import Customer from "../../entity/customer";
import EnviaConsoleLogHandler from "./envia-console-log.handler";
import Address from "../../entity/address";

describe('Customer events tests', function () {
    it('should notify customer creation handlers', function () {
        const eventDispatcher = new EventDispatcher();
        const sinkConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const sinkConsoleLog2Handler = new EnviaConsoleLog2Handler();
        const spyLog1EventHandler = jest.spyOn(sinkConsoleLog1Handler, "handle");
        const spyLog2EventHandler = jest.spyOn(sinkConsoleLog2Handler, "handle");

        let customerCreationEvent = "CustomerCreatedEvent";
        eventDispatcher.register(customerCreationEvent, sinkConsoleLog1Handler);
        eventDispatcher.register(customerCreationEvent, sinkConsoleLog2Handler);

        expect(eventDispatcher.eventHandlers[customerCreationEvent]).toBeDefined();
        expect(eventDispatcher.eventHandlers[customerCreationEvent]).toBeDefined();
        expect(eventDispatcher.eventHandlers[customerCreationEvent][0]).toMatchObject(sinkConsoleLog1Handler);
        expect(eventDispatcher.eventHandlers[customerCreationEvent][1]).toMatchObject(sinkConsoleLog2Handler);

        Customer.createAndNotify("123", "Customer Name", eventDispatcher);

        expect(spyLog1EventHandler).toHaveBeenCalled();
        expect(spyLog2EventHandler).toHaveBeenCalled();
    });

    it('should notify changed address event', function () {
        const eventDispatcher = new EventDispatcher();
        const enviaLogHandler = new EnviaConsoleLogHandler();
        const spyLogEventHandler = jest.spyOn(enviaLogHandler, "handle");
        const customer = Customer.create("123", "Customer Name");
        let customerChangeAddressEvent = "CustomerChangeAddressEvent";
        customer.assignEventDispatcher(eventDispatcher)
        eventDispatcher.register(customerChangeAddressEvent, enviaLogHandler);

        customer.changeAddress(new Address("Rua x", 123, "123465-7", "Z"));

        expect(eventDispatcher.eventHandlers[customerChangeAddressEvent]).toBeDefined();
        expect(eventDispatcher.eventHandlers[customerChangeAddressEvent][0]).toMatchObject(enviaLogHandler);
        expect(spyLogEventHandler).toHaveBeenCalled();
    });
});