import React, { useState } from 'react';
import fetch from 'node-fetch';
import isEmail from 'sane-email-validation';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import Page from '../components/Page';

export default function Donate() {
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [amount, setAmount] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  if (checkEmail) {
    return (
      <Page title="Donate" slug="/donate">
        <Content maxWidth="container.md">
          <Heading as="h2" fontSize="5xl" mt={-2} mb={2}>Payment Link Emailed</Heading>
          <Text>
            Recently scammers have been using our donation form to test stolen credit cards. To prevent costly
            chargebacks, we have emailed you a link to complete your donation.
          </Text>
        </Content>
      </Page>
    );
  }

  return (
    <Page title="Donate" slug="/donate">
      <Content maxWidth="container.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={2}>Make a Donation</Heading>
        <Text mb={8}>
          Cod Day is a 501(c)(3) non-profit. Your donation supports our work providing welcoming and diverse
          opportunities for under-served students to explore a future in tech and beyond.
        </Text>
        {error && (
          <Box p={4} bg="red.50" borderColor="red.800" borderWidth={2} color="red.900" mb={4}>
            {error}
          </Box>
        )}
        <Grid templateColumns="1fr minmax(0, 100%)" gap={8}>
          <Text bold>Name</Text>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Text bold>Email</Text>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Text bold>Amount ($ USD)</Text>
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(Number.parseInt(e.target.value, 10) || '');
            }}
          />
        </Grid>
        <Box textAlign="center">
          <Button
            onClick={async () => {
              if (isSubmitting || !name || !email || !amount || !isEmail(email)) return;
              setIsSubmitting(true);
              try {
                const result = await fetch('/api/donate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name, email, amount }),
                });
                if (result.status === 429) throw new Error('You are trying to donate too fast.');
                else if (result.status !== 200) throw new Error('Server error, email us at team@codeday.org.');
                const { url, ok, error: err } = await result.json();
                if (err) setError(err);
                else if (typeof url !== 'undefined') window.location = url;
                else if (ok) setCheckEmail(true);
                else setError('An unknown error ocurred.');
              } catch (err) {
                setError(err.toString());
              }
              setIsSubmitting(false);
            }}
            mt={4}
            mb={4}
            colorScheme={name && email && amount && isEmail(email) ? 'green' : 'gray'}
            isLoading={isSubmitting}
            disabled={isSubmitting || !name || !email || !amount || !isEmail(email)}
          >
            Continue to Payment
          </Button>
          <Text>
            You will be taken to our payment processor, Stripe, to complete your donation by card or ACH transfer.
          </Text>
          <Text>
            <Text as="span" bold>Check Donations:</Text> make payable to &ldquo;Student Research and Development&rdquo;
            and mail to:<br />340 S Lemon Ave, #7763, Walnut CA 91789.
          </Text>
          <Text>
            <Text as="span" bold>Employer Matching:</Text> search for &ldquo;Cod Day&rdquo; or &ldquo;Student Research
            and Development&rdquo; in your employer&apos;s matching portal. Our EIN is 26-4742589.{' '}
            <Link href="https://f1.codeday.org/exempt.pdf">Download our exemption letter.</Link>
          </Text>
        </Box>
      </Content>
    </Page>
  );
}
