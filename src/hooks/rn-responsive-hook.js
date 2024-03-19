import { Dimensions, useWindowDimensions, PixelRatio } from 'react-native';

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const getScales = () => {
  //Guideline sizes are based on standard ~5" screen mobile device
  const { width, height } = Dimensions.get('window');
  const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];
  // const scale = (size) => (shortDimension / guidelineBaseWidth) * size;
  // const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size;
  // const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
  // const moderateVerticalScale = (size, factor = 0.5) =>
  //   size + (verticalScale(size) - size) * factor;
  // const moderateScale = (size, factor = 0.5) => {
  //   const _scale = width > height ? scale : verticalScale;
  //   return size + (_scale(size) - size) * factor;
  // };
  // const fontScale = (size) => size / PixelRatio.getFontScale();
  const scale = (size) => (shortDimension / guidelineBaseWidth) * size;
  const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size;
  const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
  const moderateVerticalScale = (size, factor = 0.5) =>
    size + (verticalScale(size) - size) * factor;
  return { s: scale, vs: verticalScale, ms: moderateScale, mvs: moderateVerticalScale };
};
const useResponsive = () => {
  const { height, width } = useWindowDimensions();
  const isPortrait = height > width;
  //const { s, vs, fontScale } = getScales();
  return { ...getScales(), isPortrait };
};

const useResponsiveStyles = (style) => {
  const responsiveScales = useResponsive();
  return style(responsiveScales);
};
const { s, vs, ms, mvs } = getScales();
export { s, vs, ms, mvs, useResponsive, useResponsiveStyles };
