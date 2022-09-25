import { NextApiRequest, NextApiResponse } from 'next';
import { twiml } from 'twilio';
import { google, calendar_v3 } from 'googleapis'
import { InboundSMSRequest } from '../../types/sms';
const { MessagingResponse } = twiml;

const calendarId =
    'a7f4549fe542d67b14dbca0debd3c0c3ac9a4686f8cfccb3cc9e0610f5cbcedc@group.calendar.google.com';

export default async function inboundMessage(
  req: InboundSMSRequest,
  res: NextApiResponse
) {
  const messages = [];

  const enterTime = new Date();
  enterTime.setSeconds(enterTime.getSeconds() - 60);
  let exitTime = new Date();
  exitTime.setSeconds(enterTime.getSeconds() + 60);

  let facilityOpen = false;

  try {
    const calApi = google.calendar({
      version: 'v3',
      auth: 'AIzaSyBuYDZj2vbbDtW1XwnyhhDBEX9TdhR_zHM',
    });

    const calQueryRes = await calApi.freebusy
      .query({
        requestBody: {
          // Set times to ISO strings as such
          timeMin: enterTime.toISOString(),
          timeMax: exitTime.toISOString(),
          timeZone: 'US/Central',
          items: [{ id: calendarId }],
        },
      })
    const { busy, errors } = calQueryRes.data.calendars?.[calendarId] as calendar_v3.Schema$FreeBusyCalendar
    if (errors) {
      throw new Error(errors.toString());
    } else {
      // Facility is open if there are planned events
      facilityOpen = !!busy?.length
    }
  } catch (err) {
    // ...handle error
    messages.push('An error has occured, please try again later')
  }

  // Use any of the Node.js SDK methods, such as `message`, to compose a response
  // In this case we're also including the doge image as a media attachment
  // Note: access incoming text details such as the from number on `event`

  // if (currentEvents.length !== 0) {
  //   messages.push('[DOOR UNLOCKED]');
  //   messages.push('Welcome to Grizzly Bear Auditorium! Enjoy your visit.');
  //   messages.push('Please clean any equipment you use before you leave.');
  //   messages.push('If you like our place, please leave us a review on Google.');
  // } else {
  //   messages.push('GRIZZLY BEAR:');
  //   messages.push(
  //     "We couldn't find a current reservation under this phone number, please double check your booking email and verify your checkin time."
  //   );
  // }

  // Return the TwiML as the second argument to `callback`
  // This will render the response as XML in reply to the webhook request
  // twiml.message(messages.join('\n'));
  // return callback(null, twiml);
  // const twiml = new MessagingResponse();
  // // Access the message body and the number it was sent from.
  // console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

  // twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}
