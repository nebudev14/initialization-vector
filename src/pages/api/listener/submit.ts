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
    res.status(500).json({ msg: "Invalid flag" });
    return;
  }

  const challenges = await prisma.challenge.findMany();
  const flags = challenges.map((challenge) =>
    AES.decrypt(
      challenge.flag as string,
      process.env.AES_KEY as string
    ).toString(utf8)
  );

  if (!flags.includes(flag)) {
    res.status(500).json({ msg: "Invalid flag" });
    return;
  }

  res.status(200).json({ msg: "success" });
}
