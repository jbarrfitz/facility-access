import { NextApiRequest, NextApiResponse } from 'next';

type SMSWebhook = {
  MessageSid: string;
  Body: string;
  From: string;
  To: string;
};

export interface InboundSMSRequest extends NextApiRequest {
  body: SMSWebhook
}