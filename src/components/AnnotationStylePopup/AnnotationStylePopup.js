import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StylePopup from 'components/StylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import { mapAnnotationToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationStylePopup.scss';

class AnnotationStylePopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired,
  };

  handleStyleChange = (property, value, triggerEvents = true) => {
    const { annotation } = this.props;

    if (triggerEvents) {
      core.setAnnotationStyles(annotation, {
        [property]: value,
      });
    } else {
      annotation[property] = value;

      const annotManager = core.getAnnotationManager();
      annotManager.redrawAnnotation(annotation);

      // force updating to make sure that the child component receive the updated styles of this.props.annotation
      // and renders correctly
      this.forceUpdate();
    }
  
    setToolStyles(annotation.ToolName, property, value, triggerEvents);
  };

  handleClick = e => {
    // see the comments above handleClick in ToolStylePopup.js
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('annotationPopup');
    }
  }

  render() {
    const { isDisabled, annotation } = this.props;
    const isFreeText =
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
        window.Annotations.FreeTextAnnotation.Intent.FreeText;
    const className = getClassName('Popup AnnotationStylePopup', this.props);
    const colorMapKey = mapAnnotationToKey(annotation);
    const style = getAnnotationStyles(annotation);

    if (isDisabled) {
      return null;
    }

    return (
      <div
        className={className}
        data-element="annotationStylePopup"
        onClick={this.handleClick}
      >
        <StylePopup
          colorMapKey={colorMapKey}
          style={style}
          isFreeText={isFreeText}
          onStyleChange={this.handleStyleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'annotationStylePopup'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnotationStylePopup);