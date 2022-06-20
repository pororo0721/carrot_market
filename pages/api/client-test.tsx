import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
){
    await client.user.create({
        data: {
            name: "John Doe",
            email: ""
        },
    });

    res.json({
        name: "John Doe",
        age: 30,
        ok:true,
    })
}