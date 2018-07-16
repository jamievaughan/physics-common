import { EventAggregator } from './EventAggregator';

export { EventHandler } from './EventHandler';
export { EventAggregator } from './EventAggregator';

// Export a default aggregator
const aggregator = new EventAggregator();
export default aggregator;