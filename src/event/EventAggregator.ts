import { EventHandler } from './EventHandler';

export type UnregisterHandler = () => boolean;

export class EventAggregator {
    private readonly _handlers: { [name: string] : EventHandler<any>[] } = { };
 
    public register<TEvent>(name: string, handler: EventHandler<TEvent>): UnregisterHandler {
        const handlers = this._handlers[name];
        if (!handlers)
            this._handlers[name] = [handler];
        else
            handlers.push(handler);

        return () => this.unregister(name, handler);
    }

    public unregister<TEvent>(name: string, handler: EventHandler<TEvent>): boolean {
        const handlers = this._handlers[name];
        if (!handlers)
            return false;

        // If only one handler exists then delete the property
        if (handlers.length <= 1) {
            delete this._handlers[name];
        }
        else {
            const index = handlers.indexOf(handler);
            if (!~index)
                return false;

            handlers.splice(index, 1);
        }

        return true;
    }

    public dispatch<TEvent>(name: string, event: TEvent): void {
        const handlers = this._handlers[name];
        if (!handlers)
            return;

        // If the handler returns true, break the handler chain loop
        for (const handler of handlers)
            if (handler.handle(event))
                break;
    }
}