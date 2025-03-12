

const {SET_FIRST_TIME_OPEN, SET_SHOW_INSTRUCTIONS} = Types;

export const setFirstTimeOpen = isFirstTime => ({
  type: SET_FIRST_TIME_OPEN,
  payload: isFirstTime,
});

export const setShowInstructions = show => ({
  type: SET_SHOW_INSTRUCTIONS,
  payload: show,
}); 