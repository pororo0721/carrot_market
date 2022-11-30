import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const chatRoom = await client.chatRoom.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      sendUser: true,
    receiveUser: true,
      messages: {
        select: {
          id: true,
          message: true,
          user: true,
        },
      },
    },
  });
  const product = await client.product.findUnique({
    where: {
      id: chatRoom?.productId,
    },
  });
  if (chatRoom?.sendUser?.id === user?.id || chatRoom?.receiveUser?.id === user?.id) {
    res.json({
      ok: true,
      chatRoom,
      product,
    });
  } else {
    res.json({ ok: false });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));