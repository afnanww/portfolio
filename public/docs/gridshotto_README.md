# GRIDSHOTTO - 3D Web Aim Trainer

An interactive, high-performance browser-based 3D aim training experience inspired by Aim Lab Gridshot. Built to test visual reflex, target tracking speed, and mouse-eye coordination.

## Game Mechanics

Players are placed in front of a dynamic 3D wall where targets appear. Hitting a target immediately destroys it, increments the score, plays a precision audio cue, and spawns another target at a random grid coordinate. The experience emphasizes continuous rhythm and zero visual latency.

## Core Features

* **Three.js WebGL Renderer**: Fully 3D scene rendering with optimal shader compilation for low-end graphics devices.
* **Precision Auditory Feedback**: Utilizes the Web Audio API for synthetic hit sounds and spatial positioning to reduce response latency.
* **Custom Crosshairs & Themes**: Customizable color palettes, grid configurations, and targeting crosshairs.
* **FPS Counter & Performance**: Built-in framerate monitor displaying real-time rendering statistics.
* **Responsive Control Scheme**: First-person style locked cursor mode utilizing the Pointer Lock API.

## Technology Stack

* **Rendering Engine**: Three.js / WebGL
* **Programming Language**: JavaScript (ES6+)
* **Audio Engine**: Web Audio API
* **Layout & UI**: HTML5 Canvas, Vanilla CSS
