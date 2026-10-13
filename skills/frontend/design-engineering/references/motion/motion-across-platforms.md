# Motion Across Platforms

The motion rules in `animation-standards.md` and `high-craft-principles.md` are written with web examples. This file maps each concept to SwiftUI, Jetpack Compose, Flutter, and WinUI, so the 04 Motion skills work on any target.

API names are given as a starting point. Check them against the toolkit version in the project.

## 1. Rules That Never Change

1. Motion explains a change: where something came from, where it went, what is now in focus.
2. Entrances decelerate, exits accelerate, moves between two on-screen points ease both ways.
3. Animate position, scale, rotation, and opacity. Avoid animating layout size every frame.
4. Motion must be interruptible. A new gesture or tap takes over mid-flight.
5. The system reduce-motion setting is honoured. Replace movement with a short fade, or with nothing.
6. One signature moment per screen. Routine actions get quick, quiet feedback.

## 2. Reduce Motion

| Platform | How to read the setting                                                              |
| -------- | ------------------------------------------------------------------------------------ |
| Web      | `@media (prefers-reduced-motion: reduce)` or `matchMedia`                            |
| SwiftUI  | `@Environment(\.accessibilityReduceMotion)`                                          |
| UIKit    | `UIAccessibility.isReduceMotionEnabled`                                              |
| macOS    | `NSWorkspace.shared.accessibilityDisplayShouldReduceMotion`                          |
| Android  | Animator duration scale: a value of 0 means animations are off                       |
| Flutter  | `MediaQuery.of(context).disableAnimations`                                           |
| Windows  | `UISettings.AnimationsEnabled`                                                       |

## 3. Durations

| Use                              | Web        | Mobile     | Desktop app |
| -------------------------------- | ---------- | ---------- | ----------- |
| Press, toggle, hover feedback    | 100 to 150 ms | 100 to 150 ms | 80 to 120 ms |
| Menu, tooltip, small disclosure  | 150 to 200 ms | 150 to 250 ms | 100 to 150 ms |
| Sheet, drawer, dialog            | 240 to 320 ms | 250 to 350 ms | 150 to 250 ms |
| Screen or page transition        | 300 to 500 ms | 300 to 400 ms | 150 to 250 ms |
| Signature moment                 | up to 800 ms | up to 600 ms | up to 400 ms |

Desktop apps run shorter: the pointer is precise, distances are small, and people repeat actions all day.

## 4. Easing

| Intent          | CSS                                   | SwiftUI              | Compose                        | Flutter                     | WinUI                               |
| --------------- | ------------------------------------- | -------------------- | ------------------------------ | --------------------------- | ----------------------------------- |
| Enter           | `cubic-bezier(0.22, 1, 0.36, 1)`      | `.easeOut`           | `LinearOutSlowInEasing`        | `Curves.easeOutCubic`       | `CubicEase` with `EaseOut`          |
| Exit            | `cubic-bezier(0.4, 0, 1, 1)`          | `.easeIn`            | `FastOutLinearInEasing`        | `Curves.easeInCubic`        | `CubicEase` with `EaseIn`           |
| Move on screen  | `cubic-bezier(0.65, 0, 0.35, 1)`      | `.easeInOut`         | `FastOutSlowInEasing`          | `Curves.easeInOutCubic`     | `CubicEase` with `EaseInOut`        |
| Mechanical step | `steps(n)` or `linear`                | `.linear`            | `LinearEasing`                 | `Curves.linear`             | Linear key frames                   |

## 5. Springs

Use a spring for things that behave like objects: sheets, cards being dragged, toggles, pull to refresh. A spring carries the gesture's velocity into the animation, which a timed curve cannot do.

| Feel                      | SwiftUI                                         | Compose                                                        | Flutter                                         |
| ------------------------- | ----------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Snappy, no overshoot      | `.spring(response: 0.3, dampingFraction: 1.0)`  | `spring(dampingRatio = 1f, stiffness = Spring.StiffnessMedium)` | `SpringDescription.withDampingRatio(mass: 1, stiffness: 400, ratio: 1.0)` |
| Gentle settle             | `.spring(response: 0.45, dampingFraction: 0.85)` | `spring(dampingRatio = 0.85f, stiffness = Spring.StiffnessMediumLow)` | ratio 0.85, stiffness 250              |
| Playful bounce            | `.spring(response: 0.5, dampingFraction: 0.65)` | `spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow)` | ratio 0.65, stiffness 180 |

On the web, approximate a spring with `cubic-bezier(0.16, 1, 0.3, 1)` for no overshoot, or use a motion library that models springs. WinUI offers spring natural-motion animations in the composition layer.

Bounce belongs on playful products and on direct manipulation. Keep it out of business systems and routine navigation.

## 6. Navigation Transitions

Use the platform's own transition for moving between screens. Custom motion is for content inside a screen.

| Platform | Built-in patterns                                                              |
| -------- | ------------------------------------------------------------------------------ |
| iOS      | Push and pop in a navigation stack, sheet presentation, zoom transitions       |
| Android  | Shared axis, fade through, container transform, predictive back                |
| Flutter  | Page route transitions per platform, `Hero` for shared elements                |
| Windows  | Connected animation, drill-in, entrance and slide navigation transitions       |
| Web      | View transitions between pages or states, with a plain fallback                |

Shared-element transitions (an item growing into its detail screen) are the strongest way to keep context. Use them for list-to-detail moves on every platform that offers them.

## 7. Gestures

- A drag follows the finger one to one. Easing starts only after release.
- Release velocity carries into the settle animation.
- Dismiss thresholds use distance or velocity, whichever is met first.
- Never block the system back gesture or the edge swipe.
- Every gesture has a visible control that does the same thing.

## 8. Performance

| Platform | Keep off the hot path                                                            |
| -------- | -------------------------------------------------------------------------------- |
| Web      | Layout properties, large blurs, animating `box-shadow`                           |
| SwiftUI  | Recomputing large view bodies per frame; prefer `drawingGroup` only when measured |
| Compose  | State reads in composition for per-frame values; read them in layout or draw     |
| Flutter  | Rebuilding large subtrees per tick; use `AnimatedBuilder` with a `child`         |
| WinUI    | Storyboards that animate layout; prefer composition-layer animations             |

Profile on a mid-range device, not a development machine.

## 9. Haptics and Sound

- Haptics confirm: a selection, a success, an error. One pattern per meaning.
- No haptic on every tap, and none during continuous scrolling.
- Sound is opt-in.

## 10. Checklist

- Reduce-motion read through the platform API and honoured.
- Durations from the column for the target.
- Springs only on object-like elements; no bounce in business systems.
- Platform navigation transitions used for screen changes.
- Gestures interruptible, with a visible alternative.
- Profiled on a mid-range device.
