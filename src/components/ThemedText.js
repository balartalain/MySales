import { Text } from 'react-native';
//import { moderateScale } from 'react-native-size-matters';
import { useResponsive } from '../hooks/rn-responsive-hook';
const TText = ({ h1, h2, h3, h4, h5, p, bold, italic, title, style, ...rest }) => {
  const { s, vs, ms, mvs } = useResponsive();
  return (
    <Text
      style={[
        h1 && { fontSize: mvs(48) },
        h2 && { fontSize: mvs(32) },
        h3 && { fontSize: mvs(20) },
        h4 && { fontSize: mvs(18) },
        h5 && { fontSize: mvs(16) },
        p && { fontSize: mvs(12) },
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
