import {EventDispatcher} from "./event.dispatcher";
import {SendEmailWhenProductIsCreatedHandler} from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";

describe('Domain events tests', function () {
    it('should register an event handler', function () {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it('should unregister an event handler', function () {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it('should unregister all event handlers', function () {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.eventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it('should notify all event handlers', function () {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        let eventName = "ProductCreatedEvent";
        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.eventHandlers[eventName]).toBeDefined();
        expect(eventDispatcher.eventHandlers[eventName].length).toBe(1);
        expect(eventDispatcher.eventHandlers[eventName][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});