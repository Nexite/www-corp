import React, { useState, useEffect } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import Content from '@codeday/topo/Molecule/Content';
import { useQuery } from '../../query';
import { useCurrentColor } from '@codeday/topo/Theme';

export default function Employees(props) {
  const { account: { employees } } = useQuery();

  const titleContents = ['Director', 'Manager', 'Lead'];
  const titlePrecedence = (title) => titleContents
    .reduce((accum, t, i) => (title && (title.indexOf(t) >= 0) ? Math.min(i, accum) : accum), titleContents.length);
  const sortedEmployees = employees.sort((a, b) => {
    const aPrec = titlePrecedence(a.title);
    const bPrec = titlePrecedence(b.title);
    if (aPrec !== bPrec) return aPrec - bPrec;

    if (a.name > b.name) return -1;
    if (b.name > a.name) return 1;
    return 0;
  });

  return (
    <Content wide {...props}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {sortedEmployees.map((emp) => (
          <Box p={4}>
            <Box>
              <Image
                src={emp.picture.replace('256x256', 'w=100;h=100;fit=crop').replace('s=480', 's=64')}
                float="left"
                mr={4}
                rounded="full"
                w="64px"
                h="64px"
                alt=""
              />
              <Text mb={0} pt={2} bold>{emp.name}</Text>
              <Text fontSize="sm" color="current.textLight">{emp.title || 'Employee'}, {emp.pronoun}</Text>
            </Box>
            <Box ml="64px" pl={4}>
              <Text>{emp.bio || `${emp.name} is ${emp.title ? `the ${emp.title}` : 'an employee'} at CodeDay.`}</Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Content>
  );
}
