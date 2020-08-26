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

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [url, setURL] = useState('');
  const urlInput = React.createRef();

  // Hack to close modal if hotkey to open other tool is used.
  useEffect(() => {
    if (activeToolName !== 'AnnotationCreateSignature') {
      dispatch(actions.closeElement('ThreeDModal'));
    }
  }, [dispatch, activeToolName]);

  useEffect(() => {
    if (isOpen) {
      urlInput.current.focus();
      dispatch(actions.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal']));
    }
  }, [dispatch, isOpen]);

  const closeModal = () => {
    dispatch(actions.closeElement('ThreeDModal'));
    setURL('');
    core.setToolMode(defaultTool);
  };

  const drawThreeDHandler = e => {
    e.preventDefault();

    const draw3DAnnotation = e => {
      // question: define this in core threeD.js class?
      const defaultW = 300;
      const defaultH = 300;

      const threeD = new Annotations.ThreeDAnnotation();
      threeD['link'] = url;
      threeD.X = e.layerX;
      threeD.Y = e.layerY;
      threeD.Width = defaultW;
      threeD.Height = defaultH;

      core.addAnnotations([threeD]);
      core.drawAnnotations(threeD.PageNumber, null, true);
      core.removeEventListener('click', draw3DAnnotation);
    };
    core.addEventListener('click', draw3DAnnotation);
    closeModal();
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
            <div></div>
            <div>{t('link.enter3DUrl')}</div>
            <div className="linkInput">
              <input
                className="urlInput"
                type="url"
                ref={urlInput}
                value={url}
                onChange={e => setURL(e.target.value)}
              />

              <Button dataElement="linkSubmitButton" label={t('action.link')} onClick={drawThreeDHandler} />
            </div>
          </form>
        </div>
      </div>
    </Swipeable>
  );
};

export default ThreeDModal;
