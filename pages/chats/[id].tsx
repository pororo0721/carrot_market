import type { NextPage } from "next";
import Layout from "@components/layout";
import Input from "@components/input";
import Message from "@components/message";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useSWR from "swr";
import { ChatRoom, Messages , Product, User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import useDelete from "@libs/client/useDelete";


interface MessageForm {
  message: string;
}

interface MessageResponse {
  ok: boolean;
  message: string;
}

interface MessageWithUser extends Messages {
  user: User;
}

interface ChatRoomWith extends ChatRoom {
  messages: MessageWithUser[];
  sendUser: User;
  receiveUser: User;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWith;
  product: Product;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const chatRoomId = router.query.id;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [send] = useMutation<MessageResponse>(
    `/api/chats/${chatRoomId}/messages`
  );
  const { data, mutate } = useSWR<ChatRoomResponse>(
    chatRoomId ? `/api/chats/${chatRoomId}` : null,
    {
      refreshInterval: 300,
      revalidateOnFocus: true,
    }
  );
  const { data: userData } = useSWR("/api/users/me");
  const [countingNoti] = useMutation(`/api/chats/notification`);
  const [deleteNoti] = useDelete(`/api/chats/notification`);
  const lastMessage = data?.chatRoom?.messages[data?.chatRoom?.messages.length - 1];
  const deleteNotification = () => {
    if (lastMessage?.user.id !== userData?.profile?.id) {
      deleteNoti({ chatRoomId });
    }
  };
  useEffect(() => {
    if (chatRoomId && lastMessage ) {
      setInterval(deleteNotification, 3000);
    }
  }, [chatRoomId, lastMessage]);


  const onValid = (validForm: MessageForm) => {
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            messages: [
              ...prev.chatRoom.messages,
              {
                id: Date.now(),
                message: validForm.message,
                user: { ...userData.profile },
              },
            ],
          },
        } as any),
      false
    );
    send(validForm);
    if (chatRoomId) {
      countingNoti({ chatRoomId });
    }
    reset();
  };
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [data]);

  return (
    <>
      <Layout canGoBack seoTitle="Chat Room">
        <div className="md:mx-auto md:max-w-4xl mt-10">
          <div className="relative pb-4 border-b w-full opacity-80 flex items-center space-x-3 ">
            <div className="ml-5">
              <Link href={`/products/${data?.product?.id}`}>
                <a>
                  <Image
                    alt="product"
                    width={70}
                    height={70}
                    className="object-cover rounded-lg"
                    quality={100}
                  />
                </a>
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-700 dark:text-white">
                {data?.product?.name}
              </span>
              <span className="text-sm font-semibold">
              $ {data?.product?.price
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                
              </span>
            </div>
          </div>
          <div className="px-4 py-2 space-y-5">
            <div className="">
              <div className="space-y-7 mb-6 ">
                {data?.chatRoom?.messages?.map((message) => (
                  <div key={message.id}>
                    <Message
                      avatar={message.user.avatar}
                      text={message.message}
                      mine={
                        message.user.id === userData?.profile?.id ? true : false
                      }
                    />
                  </div>
                ))}
              </div>
              <form className="mb-4" onSubmit={handleSubmit(onValid)}>
                <Input
                  name="chat"
                  label="Chat"
                  kind="chat"
                  type = "text"
                  register={register("message", { required: true })}
                  required
                />
              </form>
            </div>
          </div>
        </div>
      </Layout>

      <div ref={scrollRef} />
    </>
  );
};

    
//       <div className="py-10 pb-16 px-4 space-y-4">
//         <Message message="Hi how much are you selling them for?" />
//         <Message message="I want ￦20,000" reversed />
//         <Message message="미쳤어" />
//         <form className="fixed py-2 bg-white  bottom-0 inset-x-0">
//           <div className="flex relative max-w-md items-center  w-full mx-auto">
//             <input
//               type="text"
//               className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
//             />
//             <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
//               <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
//                 &rarr;
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// };

export default ChatDetail;