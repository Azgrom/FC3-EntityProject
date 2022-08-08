import EventDispatcherInterface from "../@shared/event-dispatcher.interface";
import EventHandlerInterface from "../@shared/event-handler.interface";
import EventInterface from "../@shared/event.interface";
import Customer from "../../entity/customer";

export default class CustomerChangedAddressDispatcher implements EventDispatcherInterface {
    private _eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

    get eventHandlers(): { [p: string]: EventHandlerInterface[] } {
        return this._eventHandlers;
    }

    notify(event: EventInterface): void {
        const eventName = event.constructor.name;
        if (this.eventHandlers[eventName]) {
            this.eventHandlers[eventName].forEach((eventHandler) => {
                eventHandler.handle(event);
            })
        }
    }

    register(eventName: string, eventHandler: EventHandlerInterface): void {
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface): void {
    }

    unregisterAll(): void {
    }
}