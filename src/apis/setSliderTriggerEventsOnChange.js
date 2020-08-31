import actions from 'actions';

export default store => triggerOnChange => {
  store.dispatch(actions.setSliderTriggerEventsOnChange(triggerOnChange));
};