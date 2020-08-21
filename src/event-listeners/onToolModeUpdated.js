import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (newTool, oldTool) => {
  let isTextSelectTool = false;
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
    isTextSelectTool = true;
  }

  if (newTool && newTool.name === defaultTool && !isTextSelectTool) {
    dispatch(actions.setActiveToolGroup(''));
    dispatch(actions.closeElement('toolsOverlay'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  fireEvent('toolModeChanged', [newTool, oldTool]);
};