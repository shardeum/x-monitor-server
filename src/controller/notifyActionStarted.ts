import axios from "axios";
import { RequestWithBody } from "../interface/interface";
import log4js from "log4js";
import config from "../config";
import { Response } from "express";

const logger = log4js.getLogger("notifyActionStarted")

export async function notifyActionStarted(
  req: RequestWithBody,
  res: Response
) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
  const slackChannelId = process.env.SLACK_CHANNEL_ID
  const networkName = process.env.NETWORK_NAME || `monitor at ${config.host}`

  if (!slackWebhookUrl && !slackChannelId) {
    return logger.warn("neither Slack webhook URL nor channel ID are provided");
  } else if (!slackWebhookUrl) {
    return logger.warn("Slack webhook URL is not provided");
  } else if (!slackChannelId) {
    return logger.warn("Slack channel ID is not provided");
  }

  await axios.post(slackWebhookUrl, {
    action_name: req.body.action,
    slack_channel: slackChannelId,
    network_name: networkName
  });

  res.send()
}
