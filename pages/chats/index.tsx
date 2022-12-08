import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import ProfileInfo from "@components/profile";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ChatRoom, Messages, User } from "@prisma/client";
import { useState } from "react";
import useDelete from "@libs/client/useDelete";
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
//     <Layout  hasTabBar title="채팅" seoTitle="Chat Room">
//       <div className="flex justify-end my-1 mr-2">
//         <button
//           onClick={activeDeleteBtn}
//           className="mr-2 md:fixed md:top-6 right-36 z-20"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-6 h-6 md:w-7 md:h-7"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//             />
//           </svg>
//         </button>
//       </div>
//       <div className="divide-y-[1px] sm:py-2 md:max-w-4xl md:mx-auto">
//         {data?.chatRooms?.map((chatRoom: any) =>
//           chatRoom.sendUserId   === userData?.profile?.id ||
//           chatRoom.receiveUserId  === userData?.profile?.id ? (
//             chatRoom.messages[0] ? (
//               <div
//                 className="flex justify-between items-center border-none cursor-pointer"
//                 key={chatRoom.id}
//                 onClick={() =>
//                   router.push(active ? "" : `chats/${chatRoom.id}`)
//                 }
//               >
//                 <ProfileInfo
//                   big
//                   name={
//                     chatRoom.sendUserId=== userData?.profile?.id
//                       ? chatRoom.receiveUser.name
//                       : chatRoom.receiveUserId === userData?.profile?.id
//                       ? chatRoom.sendUser.name
//                       : ""
//                   }
//                   avatar={
//                     chatRoom.sendUserId === userData?.profile?.id
//                       ? chatRoom.receiveUser.avatar
//                       : chatRoom.receiveUserId === userData?.profile?.id
//                       ? chatRoom.sendUser.avatar
//                       : ""
//                   }
//                   subtitle={chatRoom.messages?.[0].message}
//                   position={"m-4"}
//                 />
//                 <div className="mr-4 space-x-2 flex items-center">
//                   {chatRoom.messages?.[0].userId !== userData?.profile?.id ? (
//                     chatRoom._count.notifications !== 0 ? (
//                       <span className="text-sm text-white w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
//                         {chatRoom._count.notifications}
//                       </span>
//                     ) : (
//                       <span></span>
//                     )
//                   ) : (
//                     <span></span>
//                   )}
//                   {active ? (
//                     <button onClick={() => onClicked(chatRoom.id)}>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-6 h-6 text-gray-700 dark:text-gray-300"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </button>
//                   ) : (
//                     <span className="text-xs text-gray-400 mr-5 ">
//                       {timeForToday(
//                         Number(new Date(`${chatRoom.messages[0].updatedAt}`))
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : null
//           ) : null
//         )}
//       </div>
//     </Layout>
//   );
// };


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
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;