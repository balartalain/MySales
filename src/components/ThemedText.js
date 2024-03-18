import { Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
const TText = ({ h1, h2, h3, h4, h5, p, bold, italic, title, style, ...rest }) => {
  return (
    <Text
      style={[
        h1 && { fontSize: moderateScale(48) },
        h2 && { fontSize: moderateScale(32) },
        h3 && { fontSize: moderateScale(20) },
        h4 && { fontSize: moderateScale(18) },
        h5 && { fontSize: moderateScale(16) },
        p && { fontSize: moderateScale(12) },
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
