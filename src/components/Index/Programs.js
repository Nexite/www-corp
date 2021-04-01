import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { CodDay } from '@codeday/topo/Atom/Logo';
import { nextUpcomingEvent, formatInterval } from '../../utils/time';
import { useQuery } from '../../query';

function NextEventDate({ upcoming }) {
  const next = nextUpcomingEvent(upcoming);
  return next ? (
    <Text color="current.textLight" mb={0} bold>
      Next event: {formatInterval(next.startsAt, next.endsAt)}
    </Text>
  ) : (
    <></>
  );
}

export default function Programs() {
  const { cms: { regions, mainPrograms, otherPrograms, codeDayProgram } } = useQuery();
  const codeDay = codeDayProgram?.items[0];
  let programs = codeDay?.linkedFrom?.events?.items;
  mainPrograms?.items?.map(program => programs = programs.concat(program.linkedFrom?.events?.items));
  const nextEventDate = nextUpcomingEvent(programs)

  return (
    <Content>
      <Heading as="h2" fontSize="5xl" textAlign="center" mb={16} mt={16} bold>Attend an Event</Heading>

      {/* CodeDay */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <Box borderWidth={1} borderRadius={2} p={4} boxShadow="md">
          <CodDay fontSize="4xl" withText />
          {JSON.stringify(nextUpcomingEvent(codeDay?.linkedFrom?.events?.items)) == JSON.stringify(nextEventDate) && Math.floor((nextUpcomingEvent(codeDay?.linkedFrom?.events?.items).startsAt - new Date()) / (24 * 60 * 60 * 1000)) <= 30 &&
            <Image src="/soon.svg" height={10} alt="" float="right" />}
          <NextEventDate upcoming={codeDay?.linkedFrom?.events?.items} />
          <Text fontSize="md" mt={4} mb={4}>{codeDay?.shortDescription.replace("CodeDay", "Cod Day")}</Text>
          <Text fontSize="md" mb={4} bold>Choose a location:</Text>
          <Box borderWidth={1} maxHeight={{ base: "sm", md: "lg" }} overflowY="auto">
            {regions?.items?.map((region) => (
              <Box
                p={2}
                as="a"
                d="block"
                href={`https://event.codeday.org/${region.webname}`}
                target="_blank"
                fontSize="xl"
                borderBottomWidth="1px"
                key={region.webname}
              >
                {region.name}
              </Box>
            ))}
          </Box>
        </Box>

        {/* More Programs */}
        <Box>
          {mainPrograms?.items?.map((program) => (
            <Box
              borderBottomWidth={1}
              p={4}
              mb={4}
              d="block"
              as="a"
              href={program.url}
              target="_blank"
              rel="noopener"
              key={program.url}
            >
              <Box mb={1}>
                <Box float="left" width={10} pr={4}>
                  <Image src={program.logo.url} height={6} alt="" />
                </Box>
                {JSON.stringify(nextUpcomingEvent(program.linkedFrom?.events?.items)) == JSON.stringify(nextEventDate) && Math.floor((nextUpcomingEvent(program.linkedFrom?.events?.items).startsAt - new Date()) / (24 * 60 * 60 * 1000)) <= 30 &&
                  <Image src="/soon.svg" height={10} alt="" float="right" />}
                <Text fontSize="lg" mb={0} bold>{program.name.replace("CodeDay", "Cod Day")}</Text>
              </Box>
              <NextEventDate upcoming={program.linkedFrom?.events?.items} />
              <Text mt={2} clear="both">{program.shortDescription}</Text>
              <Box>
                <Button size="sm">Learn More &raquo;</Button>
              </Box>
            </Box>
          ))}

          {/* Even more programs! */}
          <Grid templateColumns="repeat(3, 1fr)" textAlign="center" gap={4}>
            {otherPrograms?.items?.map((prog, i) => (
              <Box
                borderRightWidth={Math.min(1, (i + 1) % 3)}
                p={4}
                mb={4}
                d="block"
                as="a"
                href={prog.url}
                target="_blank"
                rel="noopener"
                key={prog.url}
              >
                <Image d="inline-block" src={prog.logo.url} height={12} mb={2} />
                <br />
                <Text fontSize="lg" mb={0} bold>{prog.name.replace("CodeCup", "CodCup").replace("Big Data", "Big Catch")}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Content>
  )
}
