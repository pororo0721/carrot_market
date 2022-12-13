import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import ProfileInfo from "@components/profile";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ChatRoom, Messages, User } from "@prisma/client";
import { useState } from "react";
import useDelete from "@libs/client/useDelete";
import Pagenation from "@components/pagination";
import usePage from "@libs/client/usePage";
import timeForToday from "@libs/client/timeForToday";

interface ChatRoomWith extends ChatRoom {
  messages: Messages[];
  sendUser: User;
  receiveUser: User;
  _count: { notifications: number };

}

interface ChatRoomResponse {
  ok: boolean;
  chatRooms: ChatRoomWith[];
}



const Chats: NextPage = () => {
  const router = useRouter();
  const {data: userData} = useSWR("/api/users/me");
  const [{ data: dataJson }, pagination] =
  usePage("/api/chats");
  const {data} = useSWR<ChatRoomResponse>("/api/chats");
  const[active, setActive] = useState(false);
  const activeDeleteBtn = () => {
    setActive((prev) => !prev);
  };
  const[deleteChatRoom] = useDelete("/api/chats");
  const onClicked =(id: number) => {
    deleteChatRoom(id);
    location.reload();
  };

  return (

    <Layout hasTabBar title="채팅" seoTitle="Chats" >
      <div className="divide-y-[1px] ">

        {data?.chatRooms?.map((chatRoom: any) => (

          <Link href={`/chats/${chatRoom.id}`} key={chatRoom.id}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">✉️: {chatRoom.sendUser.name}</p>
                <p className="text-gray-700">📮: {chatRoom.receiveUser.name}</p>
                <p className="text-gray-700">💬: {chatRoom.messages[0]?.message}</p>
              </div>
              <div className="mr-4 space-x-2 flex items-center">
              <span className="text-xs text-gray-400 mr-5 ">
                      {timeForToday(
                 Number(new Date(`${chatRoom.messages[0].updatedAt}`))
             )}
                  </span>

              </div>
  
            </a>
          </Link>
        ))}
        <Pagenation {...pagination} />
      </div>
    </Layout>
  );
};

export default Chats;