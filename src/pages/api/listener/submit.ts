import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { AES } from "crypto-ts";
const utf8 = require("crypto-ts").enc.Utf8;

/* API endpoint for submitting challenge flags */

export default async function submitFlag(
  req: NextApiRequest,
  res: NextApiResponse
) { 
  const flag = (req.body.flag as string).replace("\n", ""); // Clean up input

  /* Flags always start with embsec{ */
  if (!flag.startsWith("embsec{")) {
    res.status(500).json({ Msg: "Failed" });
    return;
  }

  /* Query corresponding challenge to flag. Validate if it exists */
  const challenges = await prisma.challenge.findMany();
  const completedChallenge = challenges.find(
    (e) =>
      flag ===
      AES.decrypt(e.flag as string, process.env.AES_KEY as string).toString(
        utf8
      )
  );

  if (!completedChallenge) {
    res.status(500).json({ Msg: "Failed" });
    return;
  }

  /* Generate a unique submission link for the student */
  const submissionLink = await prisma.submitChallenge.create({
    data: {
      challengeId: completedChallenge.id,
    },
    include: {
      Challenge: true
    }
  });

  res.status(200).json({ Msg: "Success", Name: submissionLink.Challenge?.name as string, Link: (process.env.URL as string) + "/submit/" + submissionLink.id });
}
