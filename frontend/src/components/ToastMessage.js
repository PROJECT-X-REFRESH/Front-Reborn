import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing} from 'react-native';
import styled from 'styled-components/native';
import colors from '../constants/colors';

const {width, height} = Dimensions.get('window');
const slideFrom = height;
const slideTo = height * 0.72;

const ToastMessage = ({message, onHide}) => {
  const translateY = useRef(new Animated.Value(slideFrom)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: slideTo,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: slideFrom,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(onHide);
    }, 4000);

    return () => clearTimeout(timer);
  }, [translateY, onHide]);

  return (
    <ToastContainer style={{transform: [{translateY}]}} pointerEvents="none">
      <ToastText>{message}</ToastText>
    </ToastContainer>
  );
};

const ToastContainer = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  left: 10%;
  width: 80%;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 30px;
  border-radius: 14px;
  z-index: 99;
  align-items: center;
`);

const ToastText = styled.Text`
  color: ${colors.brown};
  font-family: 'NPSfont_regular';
  font-size: ${width * 0.032}px;
  line-height: 15px;
`;

export default ToastMessage;
