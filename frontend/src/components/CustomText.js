import React from 'react';
import {Text, StyleSheet} from 'react-native';
import colors from './../constants/colors';

const NpsText = ({style, children, ...props}) => {
  return (
    <Text style={[styles.npstext, style]} {...props}>
      {children}
    </Text>
  );
};

const NpsBText = ({style, children, ...props}) => {
  return (
    <Text style={[styles.npsbtext, style]} {...props}>
      {children}
    </Text>
  );
};

const KyoboText = ({style, children, ...props}) => {
  return (
    <Text style={[styles.kyobotext, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  npstext: {
    fontFamily: 'NPSfont_regular',
    color: colors.brown,
  },
  npsbtext: {
    fontFamily: 'NPSfont_bold',
    color: colors.brown,
  },
  kyobotext: {
    fontFamily: 'KyoboHandwriting2019',
    color: colors.brown,
  },
});

export {NpsText, NpsBText, KyoboText};
