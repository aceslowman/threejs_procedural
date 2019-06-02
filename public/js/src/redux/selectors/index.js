// SELECTOR

import { createSelector } from 'reselect';

export const getTerrain = (state) => state.terrain;
export const getPasses = (state) => state.passes.byId;

export const getCameras = (state) => state.cameras.byId;
export const getActiveCamera = (state) => state.cameras.byId[state.cameras.active];

// export const getChanged

// import { createSelector } from 'reselect'

// const getVisibilityFilter = (state) => state.visibilityFilter
// const getTodos = (state) => state.todos

// export const getVisibleTodos = createSelector(
//     [getVisibilityFilter, getTodos],
//     (visibilityFilter, todos) => {
//         switch (visibilityFilter) {
//             case 'SHOW_ALL':
//                 return todos
//             case 'SHOW_COMPLETED':
//                 return todos.filter(t => t.completed)
//             case 'SHOW_ACTIVE':
//                 return todos.filter(t => !t.completed)
//         }
//     }
// )