#webgl-visualizer

A WebGL visualizer using three.js

Experiment with it by going to http://ulyssesp.github.io/webgl-visualizer.

----

## Basics

Audio is provided either from the mic by clicking the mic button, or from soundcloud. There's a default track loaded from soundcloud, but you can paste a soundcloud url in the text box to the right of the mic. When you press enter, the track or playlist will be loaded.

An object in the scene is called a Dancer. It has a unique id. There can be unlimited Dancers in a scene (restricted only by your graphics card and cpu).

Each Dancer moves according to a Dance. It can only have one dance at this time.

Each Dancer is colored with a DanceMaterial.

Changing Dancers in a scene is called a move. Changing multiple at a time is called a beat. A beat can contain any number of moves.

A routine is a sequence of beats played one after another and looped when it reaches the end.

## Creating a routine

A move consists of any change, addition, or removal of a single dancer. To create a move, fill out the various parameters in the gui and click `preview`. When you're ready to save the move that you made, click `add`.

When you're satisfied with how the scene looks, you can either click `playNext` which will take you to the next beat (or loop), or `insertBeat` which will insert a new beat into the routine. If you click `insertBeat`, the scene will look the same beacuse the new beat has no moves, and no moves means no changes.

## Saving and loading routines

Once you've created a routine, you can save it by giving it a name and clicking "Push" in the top left corner. The routine will be uploaded to my server. 

To load a routine, choose one from the drop down in the bottom left. It will show up in the text box. When you're ready, clicking "Queue" will add it to the end of the routine queue.

## Dancers

`CubeDancer` - a cube

`SphereDancer` - a sphere

`PointCloudDancer` - a point cloud with the specified number of points randomly distributed between the specified distances

## Dances

`ScaleDance` - a dance that changes the Dancer's scale based on volume

`PositionDance` - dance that changes the Dancer's position based on volume

## DanceMaterials

`ColorDanceMaterial` - a material that changes lightness based on volume, saturation based on frequency, and rotates through colors starting at the specified color

`ShaderMaterial` - a shader that displays frequencies. Not useable on a `PointCloudDancer`. The different options are all the available shaders.

