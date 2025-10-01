import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { Resend } from './dist/index.mjs';

const resend = new Resend('re_dacted');
const audienceId = 'e9aa7d09-1cae-4d0d-afee-61f38b33d3f8';

// Create a contact with no first or last name
const {
  data: { id },
} = await resend.contacts.create({
  audienceId,
  email: `${randomUUID()}@example.com`,
});

try {
  // `first_name` and `last_name` initialize to `null`
  const get1 = await resend.contacts.get({ audienceId, id });
  assert(get1.data.first_name === null);
  assert(get1.data.last_name === null);

  await delay(500); // Avoid rate limiting
  await resend.contacts.update({
    audienceId,
    id,
    firstName: 'Test',
    lastName: 'User',
  });
  await delay(500);
  const get2 = await resend.contacts.get({ audienceId, id });
  assert(get2.data.first_name === 'Test');
  assert(get2.data.last_name === 'User');

  // Passing explicit `undefined` does not clear the fields
  await delay(500);
  await resend.contacts.update({
    audienceId,
    id,
    firstName: undefined,
    lastName: undefined,
  });
  await delay(500);
  const get3 = await resend.contacts.get({ audienceId, id });
  assert(get3.data.first_name === 'Test');
  assert(get3.data.last_name === 'User');

  // Passing empty strings makes the fields empty strings
  await delay(500);
  await resend.contacts.update({
    audienceId,
    id,
    firstName: '',
    lastName: '',
  });
  await delay(500);
  const get4 = await resend.contacts.get({ audienceId, id });
  assert(get4.data.first_name === '');
  assert(get4.data.last_name === '');

  // Passing `null` clears the fields
  await delay(500);
  await resend.contacts.update({
    audienceId,
    id,
    firstName: null,
    lastName: null,
  });
  await delay(500);
  const get5 = await resend.contacts.get({ audienceId, id });
  assert(get5.data.first_name === null);
  assert(get5.data.last_name === null);
} finally {
  await delay(500);
  const removed = await resend.contacts.remove({ audienceId, id });
  assert(removed.data);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
