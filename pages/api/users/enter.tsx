import mail from "@sendgrid/mail";
import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

mail.setApiKey(process.env.SENDGRID_APIKEY!);

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)


async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {phone, email} =req.body;
  const user = phone ? {phone: +phone} :email ? {email} :null;
  if (!user) return res.status(400).json({ok: false});
  const payload = Math.floor(100000 + Math.random() * 900000) +"";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone){
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}`,
    });
    console.log(message);
  } else if(email) {
    const email = await mail.send({
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL,
      subject:"Your Carrot Market Verification Email",
      text: `Your token is ${payload}`,
      html: `<strong>Your token is ${payload}</strong>`,
    });
    console.log(email);
  }

  // if (email){
  //   user = await client.user.findUnique({
  //     where:{
  //       email,
  //     },
  //   });
  //   if(user) console.log("found it.")
  //   if(!user){
  //     console.log("Did not find. will create.")
  //     user = await client.user.create({
  //       data:{
  //         name:"Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  // if (phone){
  //   user = await client.user.findUnique({
  //     where:{
  //       phone: +phone,
  //     },
  //   });
  //   if(phone) console.log("found it.")
  //   if(!phone){
  //     console.log("Did not find. will create.")
  //     user = await client.user.create({
  //       data:{
  //         name:"Anonymous",
  //         phone,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }
  return res.json({
    ok:true,

  });
}

export default withHandler("POST", handler);