import actions from 'actions';

/**
 * Sets the current active toolbar group.
 * @method WebViewerInstance#setToolbarGroup
 * @param {string} groupDataElement The groups dataElement. Default values are: toolbarGroup-View, toolbarGroup-Annotate,
 * toolbarGroup-Shapes, toolbarGroup-Insert, toolbarGroup-Measure, toolbarGroup-Edit
 * @example
WebViewer(...)
  .then(function(instance) {
    // Change the toolbar group to the `Shapes` group
    instance.setToolbarGroup('toolbarGroup-Shapes');
 */

export default store => (dataElement, title, position) => {
  store.dispatch(actions.addToolbarGroup(dataElement, title, position));
};