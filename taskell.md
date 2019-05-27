## To Do

- Research RayTracing Renderer

## Doing

- Correct FBM artifact issue.
    > Currently small artifacts exist after a FractalWarp pass.
- Begin implementing react hooks
- Correct issue with 'active' id for camera.

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
