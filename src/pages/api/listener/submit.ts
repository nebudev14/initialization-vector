import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { AES } from "crypto-ts";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const flag = AES.decrypt(req.body.flag as string, process.env.AES_KEY as string).toString()
  if(!flag.startsWith("embsec{")) {
    res.status(500).json({ msg: "Invalid flag" });
  }

  // const challenges = 

  res.status(200).json({ key: "" })
}