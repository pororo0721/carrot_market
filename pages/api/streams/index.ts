import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
const {
    session:{user},
    query:{page},
    body:{name, price, description},
} = req;
console.log(price)
if(req.method === "POST"){
    const stream = await client.stream.create({
        data: {
            name,
            price,
            description,
            user:{
                connect:{
                    id: user?.id,
                },
            },
        },
    });
    res.json({ok:true, stream});
} else if(req.method === "GET") {
  const list = await client.stream.findMany({
    take: 20,
    skip: +page * 10,
  });
  res.json({ ok: true, list });
}
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);

