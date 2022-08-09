import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if(req.method === "GET"){
    
      const {
        query:{page},
      } =req;
      const list = await client.product.findMany({ include:{
        _count:{
          select:{
            favs: true,
          },
        },
      },
      take:20,
      skip: +page *10,
    });
     
    res.json({
      ok:true,
      list,
    });
  }
  if(req.method === "POST"){
    const {
      body: { name, price, description,photoId },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET","POST"],
    handler,
  })
);