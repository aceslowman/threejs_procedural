## To Do

- Research RayTracing Renderer
    > Raytracing Renderer (kept within renderers/RaytracingRenderer.js) would be a great option here, allowing me to do some high quality non-realtime renders. Perfect!
- Camera aspect ratio is not being correctly updated onWindowResize.

## Doing

- Define initial state in reducer, instead of mixing it into the 'sketch' logic.
    > This sounds preferable, and allows the Sketch component to be pretty slim. Sketch should 'run' the app, and all custom configurables (serializables?) would be initialized in their respective reducer. 
    * [ ] Read up on how to best organize reducers.
    * [ ] Implement Normalizr?
    * [ ] If I'm serializing objects before inserting them into the store, should I use the reducer to store the initial state?
- Correct FBM artifact issue.
    > Currently small artifacts exist after a FractalWarp pass.
    * [ ] Check sampling functions
    * [ ] Check negative dot product
    * [ ] Check for divide by zero
    * [ ] Clamp values?

## Done

- Try storing gui elements in the Sketch state.
- Attempt to use dis-gui, instead of dat-gui.
- Observe state, and identify the pattern that will allow this gui system to work.
- Fill state up with values from Sketch.
- Connect GUI elements to store, and get interactions working between the GUI and the Sketch.
- Update forked dis-gui
- Create 'CameraGUI' panel, and connect at least one parameter.
    > Add focal length slider.
- Correct ReactRouter refresh issue.
    * [ ] 
- Prune unneeded git branches.
- Throttle the GUI update to sync with framerate.
- Add stats.js
- Add pass parameters to MapGUI
- add seed uniform on shaders.
- Rethink directory structure
- Rethink current Manager system
- Fix issue where CameraGUI fails to mount on first click.
- Fix toolbar dragging.
- Remove the GUI from the Sketch.
- Rename Toolbar to GUI
- Rename MapGUI to MapTools, and do so with the other GUI containers.
- Merge MapTools into TerrainTools. MapTools is no longer.
- Create TerrainGUI, TerrainGUIContainer, and TerrainReducer, and populate with basic parameters.
- Add several new camera elements and figure out how to best handle them in state.
    > So far I can see the use of a First Person, Ortho, and Perspective camera. Currently they seem to be well organized in state, but I currently don't have a plan for the GUI.
- Begin incorporating MaterialUI into the CameraTools
- Hook into Redux for the current PerspectiveCameraTools
- 
- 
- Add new material ui drawer.
- Clean up and reformat the Terrain GUI component.
    > The terrain GUI has been isolated, but certain react+redux specific issues persist.
    * [ ] Fix issue where component doesn't receive updated store in time for initial render.
- Begin implementing react hooks
- Correct issue with 'active' id for camera.
- Enable OrbitControls
- Enable Orthographic Camera

## Backburner

- Use Normalizr to format store data.
    > Normalizr can be used in the container components (or is it the reducers?) to define schema, and then insert data into the store that confines to that schema.
    * [ ] 
- Change maps and passes to be stored in Object Scene format.
    > and if they can't be directly serialized in that way, I can manually serialize them
    * [ ] Store correct representation in store.
    * [ ] Update reducer to match
    * [ ] Update containers to match
    * [ ] Update presentation components where relevant.
