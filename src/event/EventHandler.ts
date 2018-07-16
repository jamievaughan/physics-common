export interface EventHandler<TEvent> {
    handle(event: TEvent): boolean;
}