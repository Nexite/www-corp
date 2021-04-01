import React from 'react';
import PropTypes from 'prop-types';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import BioInfo from './BioInfo';

export default function TextQuote({ testimonial, ...props }) {
  return (
    <Box {...props}>
      <Text
        fontSize={testimonial.quote.length > 350 ? 'xl' : '2xl'}
        fontStyle="italic"
        borderLeftWidth={2}
        pl={4}
      >
        {testimonial.quote.replace("CodeDay", "Cod Day").replace("Code", "Cod")}
      </Text>
      <BioInfo testimonial={testimonial} />
    </Box>
  );
}
TextQuote.propTypes = {
  testimonial: PropTypes.object.isRequired,
};
