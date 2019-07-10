## To Do

- [bug] Correct FBM artifact issue.
    > Currently small artifacts exist after a FractalWarp pass.
    * [ ] Check sampling functions
    * [ ] Check negative dot product
    * [ ] Check for divide by zero
    * [ ] Clamp values?
- [enhancement] When changing camera type, duplicate / copy over any parent transform.
- [feature] implement adjustable smoothing on Terrain mesh
    > This can be done using THREE.SubdivisionModifier on the Terrain mesh.
- [enhancement] use defaultProps instead of the || default method.
- [feature] add randomization feature to all ProcMap passes
- [org] create Pass template, which should include new randomization of parameters.

## Doing

- [feature] implement first person camera mode
    > this should be the beginning of my integration of ammo.js. size isn't a huge concern, and the possibility of threading using web-workers at least addresses my future performance concerns.
    * [x] install ammo.js
    * [x] allow rigidbody to fall from the Camera component
    * [ ] generate heightmap from Terrain
    * [ ] test rigidbody should collide with Terrain
    * [ ] swap out test rigidbody with Object3D, and parent it to the first person camera.
- [feature] incorporate Ammo.js
- [feature] Begin implementing RayTracing Renderer mode.
    > Currently, the obstacle is turning OFF the render cycle when switched over to raytracing, and then turning it back on when switched back to normal mode.
    * [ ] Need to kill all active workers when renderer changes.
    * [x] Terrain is not showing up displaced.
    * [ ] Light brightness has to be ludicrously high to show up in the raycasting renderer.

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
- Add gui folder to Terrain and Camera
- Re-enable the Camera GUI
- Begin implementing Storm React Diagrams
- [feature] Allow GUI to filter different navigation elements (terrain, flora, fauna, etc)
    > Current thought: I will initialize the WebGL within the constructor, leaving all react life-cycle methods specific to the GUI being rendered. 
- Incorporate WebGL classes into React classes. (this way, all logic for the store is condensed)
    > This feels a little odd, conflating the WebGL classes with the React Components, but React is calling the shots here, structurally. This will simplify subscription, and likely improve efficiency, especially as the app scales.
    * [x] Condense Terrain
    * [x] Condense Camera
    * [x] Use App.js as the new Sketch.js
    * [x] Reconnect Redux to the Terrain
    * [x] Reconnect Redux to the Camera
    * [x] Fix issue where Ortho cam is not displaying terrain properly. This is caused by the camera frustum not receiving valid initial inputs.
- [improvement] make ProceduralMap a React component.
    > This should simplify management in some ways. 
- [improvement] create custom GUI for each type of shader pass.
    > Each shader pass (which makes up a 'Map') should have it's own custom  GUI. Does this require me to shove FractalNoise into a React component for example?
    * [x] Create custom FractalNoise
    * [x] Create custom FractalWarp
    * [x] Figure out how to handle DEFINES
- [bug] Camera aspect ratio is not being correctly updated onWindowResize.
- [feature] Create new Renderer component & GUI, and pass it up to App.js using onRef().
- [bug] orbitControls are not receiving the updated renderer domElement when changed in Renderer.
- [bug] fix issue where composer passes are not being properly initialized
- [improvement] each shader should actually contain an instance of ShaderPass.
- [bug] fix issue where second map is not displaying
    > SOLUTION: disable renderToScreen on the COMPOSER
- [system]  random seed should be a member of the SketchContext 
- [system] remove all unnecessary rotation, y is now UP
- [org] create Module template.
- Research RayTracing Renderer
    > Raytracing Renderer (kept within renderers/RaytracingRenderer.js) would be a great option here, allowing me to do some high quality non-realtime renders. Perfect!
- [bug] correct 'every other change' issue with the ProceduralMap changes.
- [feature] create 'sun' light in sky that corresponds with Sky.sunSphere

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
- Research Storm React Diagrams
    > This seems incredibly useful for displaying a material graph, post processing graph, etc etc. I think it would work well as a drawer, pulled up from the bottom of the window. I should put a hold on any more 'maps and  passes' ui until I get started implementing this.
    * [ ] Can I create adjustable parameters IN the widget?
- Implement Storm React Diagrams
    > Storm React Diagrams should work well as a backbone of a shader graph display, but I am yet to figure out a simple configuration that works for me. It looks extensible enough tho... j
    * [x] Create a new Diagram panel, an expandable drawer along the bottom of the Sketch panel
    * [x] Get a number of adjustable parameters to display on the Widget. (I actually should be able to do this using a custom widget)
    * [x] Change currently displayed diagram based on selected map. This might require a closer pairing of the Diagram and the GUI.
    * [x] Disable panning, so that orbitControls still function.
    * [x] Diagram assembly is being triggered twice as much as it should
    * [ ] open / highlight current pass in MapTools and diagram
    * [ ] Should I attempt to store all diagrams, and then switch between them? Instead of generating them on the fly? I'm having listener issues, and this might simplify.
- Define initial state in reducer, instead of mixing it into the 'sketch' logic.
    > This sounds preferable, and allows the Sketch component to be pretty slim. Sketch should 'run' the app, and all custom configurables (serializables?) would be initialized in their respective reducer. 
    * [ ] Read up on how to best organize reducers.
    * [ ] Implement Normalizr?
    * [ ] If I'm serializing objects before inserting them into the store, should I use the reducer to store the initial state?
- Begin implementing simple tree map.
- [organization] Move all actions (like in TerrainContainer.js) into the respective actions folder
- [optimization] large drops in fps when changing gui navigation. due to unmounting/remounting.
- [bug] prevent maps from reinitializing each time the Terrain navigation is selected
    > pass parameters are currently being overwritten whenever the component (FractalNoise) is being re-rendered. I think my solution will be to just entirely remove react-router. My goal is not to mount / unmount, or at least it can't be as long as my webgl is tightly entwined with my gui. I can picture a way around this, by accessing the webgl via onRef.... but I'll leave that on the backburner
    * [ ] filter out navigation items in GUI.
