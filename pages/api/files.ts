import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
    const respose = await (await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/direct_upload `,
    {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            Authorization : `Bearer ${process.env.CF_TOKEN}`, 
        }
    })).json();
    console.log(respose);
  res.json({
    ok: true,
    ...respose.result,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);

