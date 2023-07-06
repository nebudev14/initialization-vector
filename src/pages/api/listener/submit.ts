import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { AES } from "crypto-ts";
const utf8 = require("crypto-ts").enc.Utf8;

export default async function submitFlag(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = req.body.flag as string;

  if (!flag.startsWith("embsec{")) {
    res.status(500).json({ Msg: "Invalid flag" });
    return;
  }

  const challenges = await prisma.challenge.findMany();
  const completedChallenge = challenges.find(
    (e) =>
      flag ===
      AES.decrypt(e.flag as string, process.env.AES_KEY as string).toString(
        utf8
      )
  );

  if (!completedChallenge) {
    res.status(500).json({ Msg: "Invalid flag" });
    return;
  }

  const submissionLink = await prisma.submitChallenge.create({
    data: {
      challengeId: completedChallenge.id,
    },
  });

  res.status(200).json({ Msg: (process.env.URL as string) + "/submit/" + submissionLink.id });
}
