import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

client.$queryRaw`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';`.then(
    async () => {
        const post = await client.post.findUnique({
            where: {
              id: +id.toString(),
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              answers: {
                select: {
                  answer: true,
                  id: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  answers: true,
                  wondering: true,
                },
              },
            },
          });
          res.json({
            ok: true,
            post,
          });
        }
);
}
  

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);