import { useWindowDimensions } from 'react-native';

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const getScales = ({ width, height }) => {
  //Guideline sizes are based on standard ~5" screen mobile device

  const scale = (size) => (width / guidelineBaseWidth) * size;
  const verticalScale = (size) => (height / guidelineBaseHeight) * size;
  const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

  return { scale, verticalScale, moderateScale };
};
const useResponsive = () => {
  const { height, width } = useWindowDimensions();
  const isPortrait = height > width;
  const { scale, verticalScale, moderateScale } = getScales({ width, height });
  console.log(width);
  return { scale, verticalScale, moderateScale, isPortrait };
};

const useResponsiveStyles = (style) => {
  const { scale, verticalScale, moderateScale, isPortrait } = useResponsive();
  return style({ scale, verticalScale, moderateScale, isPortrait });
};
export { useResponsive, useResponsiveStyles };
