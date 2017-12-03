# Evex v0.1.0

Evex is a pattern to realize the [Flux][] design pattern by means of [DOM Events][].

# Explanation

In Evex, an event object works as `Action` in Flux pattern. Triggering an event on a DOM element corresponds to `dispatch`ing an action in Flux. The bubbling mechanism works as `Dispatcher` in Flux. The parent node which handles the bubbled events (actions) corresponds to `Store`. After handling events (actions), stores change their states and dispatch `update` events back to `View`. These steps consists the Flux loop.

| Flux           | Evex                                         |
|----------------|----------------------------------------------|
| Action         | Event object                                 |
| Action Creator | Event Constructor                            |
| Dispatcher     | Event bubbling mechanism                     |
| Store          | DOM Element with action event handlers       |
| Store callback | event handler on Store                       |
| View           | DOM Element with `update` event handler      |


## Event as action

Event object works as an action in Evex. Here we call this type of event `action-event`.

An action-event should be an instance of CustomEvent. Action-event's name corresponds to the type of Action in terms of [FSA][]. CustomEvent object has versatile `detail` property. In Evex, `detail` property works as the payload of the action. An action-event should be dispatched with bubbles option `true` to reach its corresponding Store and action callbacks.

## Dispatching action-event

In Evex, there is no explicit dispatcher. Instead, the event bubbling mechanism works as the dispatcher. When an action is needed, the action-event is dispatched at the DOM element which the user interacted. The action-event bubbles up in the tree. The first parent node which knows the action's type catches it. This node is Store in Evex and this whole process works as Dispatcher in Evex.

## Store in Evex

In Evex, Store is placed somewhere in the DOM tree. If you only needs one store like redux, it should be placed at `body` element or `document`.

The store reacts and change its state according to the bubbled events. So each handling of the action should be implemented as the event handler at the store's dom element.

After handling the action, the store should publish the event to its descendant nodes that subscribe to `update` event. This event shouldn't be bubbling to avoid multiple updates on nested structures.

Example store implementation in capsid.js:

```js
const {
  component,
  on,
  notifies,
  emits
} = capsid

@component('store')
class Store {
  constructor () {
    this.count = 0
  }

  @on('increment')
  increment () {
    this.count++
    this.update()
  }

  @on('decrement')
  decrement () {
    this.count--
    this.update()
  }

  @notifies('update', '.store-observer')
  update () {
    return this.count
  }
}

@component('plus-button')
class PlusButton {
  @on.click
  @emits('increment')
  increment () {}
}

@component('minus-button')
class MinusButton {
  @on.click
  @emits('decrement')
  decrement () {}
}

@component('count-label')
class Label {
  @on('update')
  update ({ detail: count }) {
    this.el.textContent = count
  }
}
```

```html
<body class="store">
  <button class="plus-button">+</button>
  <button class="minus-button">-</button>
  <p class="store-observer count-label">0</p>
</body>
```

See [the working example](https://codepen.io/kt3k/pen/JOxZJb) in codepen.io.

In this example, `Store` implements two actions `increment` and `decrement` and it publishes `update` event to its descendant nodes that have `store-observer` class. In this example, having `store-observer` means the subscription to the store state.

# Examples

- [capsidjs/todomvc][]
  - [TodoMVC][] implementation in Evex and capsid.js.

[Flux]: https://facebook.github.io/flux/
[FSA]: https://github.com/acdlite/flux-standard-action
[DOM Events]: https://en.wikipedia.org/wiki/DOM_events
[capsid.js]: https://github.com/capsidjs/capsid
[capsidjs/todomvc]: https://github.com/capsidjs/todomvc
[TodoMVC]: http://todomvc.com/
