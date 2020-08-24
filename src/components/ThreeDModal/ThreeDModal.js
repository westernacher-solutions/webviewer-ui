import React, { useEffect, useState } from 'react';
import '@google/model-viewer/dist/model-viewer';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import core from 'core';
import defaultTool from 'constants/defaultTool';

import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import './ThreeDModal.scss';

const ThreeDModal = () => {
  const [isDisabled, isOpen, activeToolName] = useSelector(state => [
    selectors.isElementDisabled(state, 'ThreeDModal'),
    selectors.isElementOpen(state, 'ThreeDModal'),
    selectors.getActiveToolName(state),
  ]);

  const [url, setURL] = useState('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
  // const [threeDURL, setThreeDURL] = useState('');
  const urlInput = React.createRef();

  // Hack to close modal if hotkey to open other tool is used.
  useEffect(() => {
    if (activeToolName !== 'AnnotationCreateSignature') {
      dispatch(actions.closeElement('ThreeDModal'));
    }
  }, [dispatch, activeToolName]);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      urlInput.current.focus();
      dispatch(actions.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal']));
    }
  }, [dispatch, isOpen]);

  const closeModal = () => {
    dispatch(actions.closeElement('ThreeDModal'));
    // setURL('');
    core.setToolMode(defaultTool);
  };

  const addURLLink = e => {
    e.preventDefault();

    const draw3DAnnotation = e => {
      const scrollElement = window.docViewer.getScrollViewElement();
      const scrollLeft = scrollElement.scrollLeft || 0;
      const scrollTop = scrollElement.scrollTop || 0;

      const threeD = new Annotations.ThreeD();
      threeD.__customData['link'] = url;
      // TODO: Frontend passed in a wrong left and top, need to fix
      // need to pass these value dynamicly
      threeD.__customData['left'] = e.layerX + 'px';
      threeD.__customData['top'] = e.layerY + 'px';
      threeD.__customData['link'] = url;
      const pageNumberToDraw = 1;
      core.drawAnnotations(pageNumberToDraw, null, true);
      core.drawAnnotations(threeD.PageNumber, null, true);
      core.addAnnotations([threeD]);

      window.console.log('test', e);
      window.console.log('threeD', threeD);

      core.removeEventListener('click', draw3DAnnotation);
    };

    core.addEventListener('click', draw3DAnnotation);

    closeModal();
    // TODO: this is not working
    // return () => {
    //   core.removeEventListener('click', draw3DAnnotation);
    // };
  };

  const modalClass = classNames({
    Modal: true,
    ThreeDModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="ThreeDModal" onMouseDown={closeModal}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <form>
            {/* todo: translate this  */}
            <div>Enter the URL for 3D object in glTF format</div>
            <div className="linkInput">
              <input
                className="urlInput"
                type="url"
                ref={urlInput}
                value={url}
                onChange={e => setURL(e.target.value)}
              />

              <Button dataElement="linkSubmitButton" label={t('action.link')} onClick={addURLLink} />
            </div>
          </form>
          {/* {threeDURL && (
            <model-viewer
              src={threeDURL}
              loading="eager"
              alt="A 3D model of an astronaut"
              auto-rotate
              camera-orbit="-80deg 75deg 105%"
              camera-controls
              ar-modes="webxr scene-viewer quick-look fallback"
              ar-scale="auto"
              ar
            ></model-viewer>
          )} */}
        </div>
      </div>
    </Swipeable>
  );
};

export default ThreeDModal;
