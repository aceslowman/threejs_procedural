/*
  TODO: this might require multiple reducers, but for now, I'll be
  implementing them all in one below.
*/

const initial = {
  maps: {
    byId: {},
    allIds: []
  },
  passes: {
    byId: {},
    allIds: []
  }
};

/*
The state tree below seems to be at least 'fairly' normalized, at least up until
the uniforms and defines objects in 'passes'. Move ahead with this, fill up state, and then I'll figure out how to bind them to the gui objects.

maps: {
  byId: {
    "Elevation": {
      id: "Elevation",
      passes: ["FractalNoise", "FractalWarp"]
    }
  },
  allIds: ["Elevation"]
},
passes: {
  byId: {
    "FractalWarp": {
      id: "FractalWarp",
      defines: {
        "octaves": 4
      },
      uniforms: {
        "x": 1,
        "y": 2
      }
    },
    "FractalNoise": {
      id: "FractalNoise",
      defines: {
        "octaves": 4
      },
      uniforms: {
        "tex0": 'something',
        "z": 2
      }
    }
  },
  allIds: ["FractalWarp", "FractalNoise"]
}
*/

function reducer(state = initial, action) {
  switch (action.type) {
    case 'ADD_MAP':
      let passes = {};

      for(let pass in action.passes){
        passes[action.passes[pass].id] = action.passes[pass] 
      }

      // TODO: the data looks good now, and the next challenge will be connecting it to the gui elements.

      return (
        {
          ...state,
          maps: {
            byId: {
              ...state.maps.byId,
              [action.map.id]: action.map
            },
            allIds: [...state.maps.allIds, action.map.id]
          },
          passes: {
            byId: {
              ...state.passes.byId,
              ...passes
            },
            allIds: [...state.passes.allIds, ...action.passes.map(a=>a.id)]
          }
        }
      )
    case 'UPDATE_PASS_DEFINE':
      // TODO: I will need to generate some sort of UNIQUE id for each pass, appending to the end of the sanitized name.
      return (
        {
          ...state,
          passes: {
            ...state.passes,
            byId: {
              ...state.passes.byId,
              [action.passId]: {
                ...state.passes.byId[action.passId],
                defines: {
                  ...state.passes.byId.defines,
                  [action.defineId]: action.value
                }
              }
            }
          }
        }
      );
    case 'UPDATE_PASS_UNIFORM':
      // TODO: I will need to generate some sort of UNIQUE id for each pass, appending to the end of the sanitized name.
      return (
        {
          ...state,
          passes: {
            ...state.passes,
            byId: {
              ...state.passes.byId,
              [action.passId]: {
                ...state.passes.byId[action.passId],
                uniforms: {
                  ...state.passes.byId[action.passId].uniforms,
                  [action.uniformId]: { 
                    value: action.value 
                  }
                }
              }
            }
          }
        }
      );      
    default:
      return state;
  }
}

export { reducer };
