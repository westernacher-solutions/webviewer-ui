import React from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';
import StyleOption from 'components/StyleOption';

import { circleRadius } from 'constants/slider';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

import './StylePopup.scss';

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isFreeText: PropTypes.bool.isRequired,
    colorMapKey: PropTypes.string.isRequired,
    currentPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    isColorPaletteDisabled: PropTypes.bool,
    isStyleOptionDisabled: PropTypes.bool,
    isStylePopupDisabled: PropTypes.bool,
  };

  render() {
    const { isColorPaletteDisabled,
      currentPalette,
      style,
      colorMapKey,
      onStyleChange,
      isStyleOptionDisabled,
      isStylePopupDisabled } = this.props;
    const { Scale, Precision, Style } = style;

    if (isStylePopupDisabled) {
      return null;
    }
    return (
      <div
        className="Popup StylePopup"
        data-element={DataElements.STYLE_POPUP}
      >
        {currentPalette && !isColorPaletteDisabled && (
          <div className="colors-container" data-element={DataElements.COLOR_PALETTE}>
            <div className="inner-wrapper">
              <ColorPaletteHeader
                colorPalette={currentPalette}
                colorMapKey={colorMapKey}
                style={style}
              />
              <ColorPalette
                color={style[currentPalette]}
                property={currentPalette}
                onStyleChange={onStyleChange}
                colorMapKey={colorMapKey}
              />
            </div>
          </div>
        )}
        <Sliders {...this.props} />
        {Scale && Precision && (
          <MeasurementOption
            scale={Scale}
            precision={Precision}
            onStyleChange={onStyleChange}
          />
        )}
        { !isStyleOptionDisabled && colorMapKey === 'rectangle' && <StyleOption onStyleChange={onStyleChange} borderStyle={Style}/>}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
  isStylePopupDisabled: selectors.isElementDisabled(state, DataElements.STYLE_POPUP),
  isColorPaletteDisabled: selectors.isElementDisabled(state, DataElements.COLOR_PALETTE),
  isStyleOptionDisabled: selectors.isElementDisabled(state, DataElements.STYLE_OPTION)
});

export default connect(mapStateToProps)(StylePopup);

function Sliders({ style, onStyleChange, isFreeText }) {
  const isOpacitySliderDisabled = useSelector(state => selectors.isElementDisabled(state, DataElements.OPACITY_SLIDER));
  const isStrokeThicknessSliderDisabled = useSelector(state => selectors.isElementDisabled(state, DataElements.STROKE_THICKNESS_SLIDER));
  const isFontSizeSliderDisabled = useSelector(state => selectors.isElementDisabled(state, DataElements.FONT_SIZE_SLIDER));

  const hideAllSlider = isOpacitySliderDisabled && isStrokeThicknessSliderDisabled && isFontSizeSliderDisabled;
  const { Opacity, StrokeThickness, FontSize } = style;
  const lineStart = circleRadius;

  return (
    !hideAllSlider && (
      <div className="sliders-container" onMouseDown={e => e.preventDefault()}>
        <div className="sliders">
          {!isOpacitySliderDisabled && (Opacity || Opacity === 0) && (
            <Slider
              dataElement={DataElements.OPACITY_SLIDER}
              key="Opacity"
              value={Opacity}
              displayValue={`${Math.round(Opacity * 100)}%`}
              property="Opacity"
              displayProperty="opacity"
              onStyleChange={onStyleChange}
              getCirclePosition={lineLength => Opacity * lineLength + lineStart}
              convertRelativeCirclePositionToValue={circlePosition => circlePosition}
            />
          )}
          {!isStrokeThicknessSliderDisabled && (StrokeThickness || StrokeThickness === 0) && (
            <Slider
              dataElement={DataElements.STROKE_THICKNESS_SLIDER}
              key="StrokeThickness"
              value={StrokeThickness}
              displayValue={`${Math.round(StrokeThickness)}pt`}
              property="StrokeThickness"
              displayProperty="thickness"
              onStyleChange={onStyleChange}
              // FreeText Annotations can have the border thickness go down to 0. For others the minimum is 1.
              getCirclePosition={lineLength =>
                (isFreeText
                  ? (StrokeThickness / 20) * lineLength + lineStart
                  : ((StrokeThickness - 1) / 19) * lineLength + lineStart)}
              convertRelativeCirclePositionToValue={circlePosition =>
                (isFreeText ? circlePosition * 20 : circlePosition * 19 + 1)}
            />
          )}
          {!isFontSizeSliderDisabled && (FontSize || FontSize === 0) && (
            <Slider
              dataElement={DataElements.FONT_SIZE_SLIDER}
              key="FontSize"
              value={FontSize}
              displayValue={`${Math.round(parseInt(FontSize, 10))}pt`}
              property="FontSize"
              displayProperty="text"
              onStyleChange={onStyleChange}
              // FreeText Annotations can have the border thickness go down to 0. For others the minimum is 1.
              getCirclePosition={lineLength =>
                ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart}
              convertRelativeCirclePositionToValue={circlePosition =>
                `${circlePosition * 40 + 5}pt`}
            />
          )}
        </div>
      </div>
    )
  );
}