import React, { useEffect, useState } from 'react';
import '@google/model-viewer/dist/model-viewer';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';

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

  const [url, setURL] = useState('');
  const [threeDURL, setThreeDURL] = useState('');
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
    setURL('');
    dispatch(actions.closeElement('ThreeDModal'));
  };



  const addURLLink = e => {
    e.preventDefault();
    setThreeDURL(url);

    // closeModal();
  };

  const modalClass = classNames({
    Modal: true,
    ThreeDModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="ThreeDModal">
        <div className="container">
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
          {threeDURL && (
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
          )}
        </div>
      </div>
    </Swipeable>
  );
};

export default ThreeDModal;
