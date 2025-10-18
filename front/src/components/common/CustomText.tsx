import {Text, TextProps} from 'react-native';

const CustomText = ({style, ...props}: TextProps) => {
  const customStyle = {
    fontFamily: 'Pretendard-Regular',
  };

  return <Text style={[customStyle, style]} {...props} />;
};
export default CustomText;
