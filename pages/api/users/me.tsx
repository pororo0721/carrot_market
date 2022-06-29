import {withIronSessionApiRoute} from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    }
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
 
console.log(req.session.user);
const profile = await client.user.findUnique({
    where:{
        id:req.session.user?.id
    },
});

  res.json({
    ok:true,
    profile,
  });
}

export default withIronSessionApiRoute(withHandler("GET", handler),{
  cookieName:"Carrotsession",
  password:"1231546878551631546546545646461231245748732135465412132132132454",

});