import React from 'react';
import { NextSeo } from 'next-seo';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Wizard from '../../components/Volunteer/Wizard';
import Page from '../../components/Page';
import VideoTestimonialThumbnail from '../../components/VideoTestimonialThumbnail';
import { upcomingEvents } from '../../utils/time';
import { useQuery } from '../../query';
import { VolunteerQuery } from './volunteer.gql';

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

export default function Volunteer() {
  const { cms: { volunteerPrograms, testimonials } } = useQuery();
  const programsWithUpcoming = volunteerPrograms?.items?.map((program) => {
    return {
      ...program,
      upcoming: upcomingEvents(program.linkedFrom?.events?.items || []),
    };
  })
  .sort((a, b) => {
    if (a.upcoming.length > 0 && b.upcoming.length > 0)
      return a.upcoming[0].startsAt - b.upcoming[0].startsAt;
    if (a.upcoming.length > 0) return -1;
    if (b.upcoming.length > 0) return 1;
    return PROGRAM_WEIGHT.indexOf(a.type) - PROGRAM_WEIGHT.indexOf(b.type);
  })
   || [];

  const videoTestimonial = testimonials?.items?.filter((t) => t.video)[0];

  return (
    <Page slug="/volunteer" title="Volunteer">
      <NextSeo
        description="We need everyone's help to create a more inclusive tech future for students! (Even if you don't have a tech background!)"
        openGraph={{
          title: 'Volunteer for CodeDay',
          description: `We need everyone's help to create a more inclusive tech future for students! (Even if you don't have a tech background!)`,
          images: [
            {
              url: 'https://f2.codeday.org/d5pti1xheuyu/5HXduujNbKhEwAsFchjNcU/5ca87b445e48ae78593b8a4841e94775/gray-wallaby-965e09f9_o.jpg?w=1200&h=630&fit=fill',
              width: 1200,
              height: 630,
              alt: 'Volunteers watching a presentation at CodeDay.'
            }
          ]
        }}
      />
      <Content mt={-8}>
        <Heading as="h2" fontSize="5xl" mb={8} mt={8}>Have fun. Make a difference. Volunteer.</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '3fr 2fr' }} gap={8}>
          <Box fontSize="xl">
            <Text>
              We need everyone's help to create a more inclusive tech future for students! (Even if you don&apos;t
              have a tech background!)
            </Text>
            <Text mb={8}>
              For corporate volunteering please email us at{' '}
              <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link>. You can also{' '}
              <Link href="/volunteer/share">share upcoming volunteer opportunities with coworkers.</Link>
            </Text>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md" color="current.textLight" textAlign="center" mb={2}>
              Hear why {videoTestimonial.firstName}
              {videoTestimonial.company && (
                <>
                  {videoTestimonial.title ? `, ${videoTestimonial.title} at ` : ' from '}
                  {videoTestimonial.company}{videoTestimonial.title && ','}
                </>
              )}{' '}
              volunteers:
            </Heading>
            <VideoTestimonialThumbnail video={videoTestimonial} />
          </Box>
        </Grid>
        <Wizard programs={programsWithUpcoming.filter((program) => program.volunteerDetails)} />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const query = await apiFetch(print(VolunteerQuery));

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
}
