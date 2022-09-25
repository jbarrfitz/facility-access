import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const FROM_NUMBER = '+12064273176';
const accountSid = <string>process.env.ACCOUNT_SID;
const token = <string>process.env.AUTH_TOKEN;

export default function inboundMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const twiml = new MessagingResponse();
  // Access the message body and the number it was sent from.
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}
