import { Text } from 'react-native';
//import { moderateScale } from 'react-native-size-matters';
import { useResponsive } from '../hooks/rn-responsive-hook';
const TText = ({ h1, h2, h3, h4, h5, p, bold, italic, title, style, ...rest }) => {
  const { fontScale } = useResponsive();
  return (
    <Text
      style={[
        h1 && { fontSize: fontScale(48) },
        h2 && { fontSize: fontScale(32) },
        h3 && { fontSize: fontScale(20) },
        h4 && { fontSize: fontScale(18) },
        h5 && { fontSize: fontScale(16) },
        p && { fontSize: fontScale(12) },
        bold && { fontWeight: 'bold' },
        italic && { fontStyle: 'italic' },
        style,
      ]}
      {...rest}
    >
      {title}
    </Text>
  );
};

export { TText };
