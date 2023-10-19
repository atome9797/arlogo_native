import {useReducer, useCallback} from 'react';
// Usage
// function App() {
//   const {state, set, undo, redo, clear, canUndo, canRedo} = useHistory({});
//   return (
//     <div className="container">
//       <div className="controls">
//         <div className="title">👩‍🎨 Click squares to draw</div>
//         <button onClick={undo} disabled={!canUndo}>
//           Undo
//         </button>
//         <button onClick={redo} disabled={!canRedo}>
//           Redo
//         </button>
//         <button onClick={clear}>Clear</button>
//       </div>
//       <div className="grid">
//         {((blocks, i, len) => {
//           // Generate a grid of blocks
//           while (++i <= len) {
//             const index = i;
//             blocks.push(
//               <div
//                 // Give block "active" class if true in state object
//                 className={'block' + (state[index] ? ' active' : '')}
//                 // Toggle boolean value of clicked block and merge into current state
//                 onClick={() => set({...state, [index]: !state[index]})}
//                 key={i}
//               />,
//             );
//           }
//           return blocks;
//         })([], 0, 625)}
//       </div>
//     </div>
//   );
// }
// Initial state that we pass into useReducer
const initialState = {
  // Array of previous state values updated each time we push a new state
  past: [],
  // Current state value
  present: null,
  // Will contain "future" state values if we undo (so we can redo)
  future: [],
};
// Our reducer function to handle state changes based on action
const reducer = (state, action) => {
  const {past, present, future} = state;
  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    case 'REDO':
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    case 'SET':
      const {newPresent} = action;
      if (newPresent === present) {
        return state;
      }
      let _last10 = [...past, present];
      _last10 =
        _last10.length > 10 ? _last10.slice(_last10.length - 10) : _last10;
      return {
        past: _last10,
        present: newPresent,
        future: [],
      };
    case 'CLEAR':
      const {initialPresent} = action;
      console.log('initialPresent:', initialPresent);
      return {
        ...initialState,
        // past:[],
        // present: initialPresent,
        // future: [],
      };
  }
};
// Hook
export const useHistory = initialPresent => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  });
  const canUndo = state.past.length !== 1;
  const canRedo = state.future.length !== 0;
  // Setup our callback functions
  // We memoize with useCallback to prevent unnecessary re-renders
  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({type: 'UNDO'});
    }
  }, [canUndo, dispatch]);
  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({type: 'REDO'});
    }
  }, [canRedo, dispatch]);
  const setHistory = useCallback(
    newPresent => dispatch({type: 'SET', newPresent}),
    [dispatch],
  );
  const clear = useCallback(
    () => dispatch({type: 'CLEAR', initialPresent}),
    [dispatch],
  );
  // If needed we could also return past and future state
  // console.log(
  //   'state length:',
  //   state.present.length,
  //   state.past.length,
  //   state.future.length,
  // );
  return {
    state: state.present,
    past: state.past[state.past.length - 1],
    future: state.future[0],
    setHistory,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };
};
