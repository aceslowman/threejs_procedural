export const getTerrain = (state) => state.terrain;
export const getPasses = (state) => state.passes.byId;

export const getCameras = (state) => state.cameras.byId;
export const getActiveCamera = (state) => state.cameras.byId[state.cameras.active];