# Evex v0.1.0

Evex is a pattern to realize the Flux design pattern by means of [DOM Events][].

# Explanation

In Evex, an event object works as `Action` in Flux pattern. Triggering an event on a DOM element corresponds to `dispatch`ing an action in Flux. The parent node which handles the bubbling events (actions) corresponds to `Dispatcher`. After handling events (actions), stores change their states and dispatch `update` events back to `View`. These steps consists the Flux loop.

| Flux           | Evex                                         |
|----------------|----------------------------------------------|
| Action         | Event object                                 |
| Action Creator | Event Constructor                            |
| Dispatcher     | DOM Element with action event handlers       |
| Store          | any data which represents your domain models |
| View           | DOM Element with `update` event handler      |

[DOM Events]: https://en.wikipedia.org/wiki/DOM_events
