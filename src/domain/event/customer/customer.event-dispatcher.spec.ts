import EnviaConsoleLog1Handler from "./envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./envia-console-log2.handler";
import CustomerCreatedEvent from "./customer-created.event";
import {EventDispatcher} from "../@shared/event.dispatcher";
import Customer from "../../entity/customer";

describe('Customer events tests', function () {
    it('should notify customer creation handlers', function () {
        const eventDispatcher = new EventDispatcher();
        const sinkConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const sinkConsoleLog2Handler = new EnviaConsoleLog2Handler();
        const spyLog1EventHandler = jest.spyOn(sinkConsoleLog1Handler, "handle");
        const spyLog2EventHandler = jest.spyOn(sinkConsoleLog2Handler, "handle");

        let customerCreationStarted = "CustomerCreatedEvent";
        let customerCreationEnded = "CustomerCreatedEvent";
        eventDispatcher.register(customerCreationStarted, sinkConsoleLog1Handler);
        eventDispatcher.register(customerCreationEnded, sinkConsoleLog2Handler);

        expect(eventDispatcher.eventHandlers[customerCreationStarted]).toBeDefined();
        expect(eventDispatcher.eventHandlers[customerCreationEnded]).toBeDefined();
        expect(eventDispatcher.eventHandlers[customerCreationStarted][0]).toMatchObject(sinkConsoleLog1Handler);
        expect(eventDispatcher.eventHandlers[customerCreationEnded][1]).toMatchObject(sinkConsoleLog2Handler);

        new Customer("123", "Customer Name", eventDispatcher);

        expect(spyLog1EventHandler).toHaveBeenCalled();
        expect(spyLog2EventHandler).toHaveBeenCalled();
    });
});