import { Text } from 'react-native';

import UTIL from '../utils/Utils';

const TText = ({ h1, h2, h3, h4, h5, p, bold, italic, title, style, ...rest }) => {
  return (
    <Text
      style={[
        h1 && { fontSize: UTIL.adjust(48) },
        h2 && { fontSize: UTIL.adjust(32) },
        h3 && { fontSize: UTIL.adjust(20) },
        h4 && { fontSize: UTIL.adjust(18) },
        h5 && { fontSize: UTIL.adjust(16) },
        p && { fontSize: UTIL.adjust(12) },
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
