import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    session: { user },
  } = req;
  const products = await client.product.findUnique({
    where: {
      id: Number(body),
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (req.method === "GET") {
    const chatRooms = await client.chatRoom.findMany({
      include: {
        messages: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        sendUser: true,
        receiveUser: true,
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });
    res.json({ ok: true, chatRooms });
  }

  if (req.method === "POST") {
    const isChatRoom = await client.chatRoom.findFirst({
      where: {
        productId: Number(body),
        sendUserId: user?.id,
        receiveUserId: products?.userId,
      },
    });
    if (isChatRoom) {
      res.json({ isChatRoom });
    } else {
      const chatRoom = await client.chatRoom.create({
        data: {
          product: {
            connect: {
              id: Number(body),
            },
          },
          sendUser: {
            connect: {
              id: user?.id,
            },
          },
          receiveUser: {
            connect: {
              id: products?.userId,
            },
          },
        },
      });
      res.json({ ok: true, chatRoom });
    }
  }
  if (req.method === "DELETE") {
    const { body } = req;
    await client.chatRoom.delete({
      where: {
        id: Number(body),
      },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET", "DELETE"], handler })
);