#webgl-visualizer

A WebGL visualizer using three.js

Experiment with it by going to http://upopple.github.io/webgl-visualizer.

----

## Basics

An object in the scene is called a Dancer. It has a unique id. There can be unlimited Dancers in a scene (restricted only by your graphics card and cpu).

Each Dancer moves according to a Dance. It can only have one dance at this time.

Each Dancer is colored with a DanceMaterial.

Changing Dancers in a scene is called a move. Changing multiple at a time is called a beat. A beat can contain any number of moves.

A routine is a sequence of beats played one after another and looped when it reaches the end.

## Creating a routine

When you first open the visualizer, you're presented with a pre-made routine. If you click `playNext` in the gui, you'll be taken to the next beat of the routine.

A move consists of any change, addition, or removal of a single dancer. To create a move, fill out the various parameters in the gui and click `preview`. When you're ready to save the move that you made, click `add`.

When you're satisfied with how the scene looks, you can either click `playNext` which will take you to the next beat (or loop), or `insertBeat` which will insert a new beat into the routine. If you click `insertBeat`, the scene will look the same beacuse the new beat has no moves, and no moves means no changes.

## Dancers

`CubeDancer` - a cube

`SphereDancer` - a sphere

`PointCloudDancer` - a point cloud with the specified number of points randomly distributed between the specified distances

## Dances

`ScaleDance` - a dance that changes the Dancer's scale based on volume

`PoistionDance` - dance that changes the Dancer's position based on volume

## DanceMaterials

`ColorDanceMaterial` - a material that changes lightness based on volume, saturation based on frequency, and rotates through colors starting at the specified color

`ShaderMaterial` - a shader that displays frequencies. Not useable on a `PointCloudDancer`.

