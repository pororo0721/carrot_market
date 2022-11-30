import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useSWR from "swr";
import { ChatRoom, Messages , Product, User } from "@prisma/client";
import Link from "next/link";


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
  const chatId = router.query.id;
  const scrollRef = useRef<HTMLDivElement>(null);
  const {register, handleSubmit, reset} = useForm<MessageForm>();
  const [send] = useMutation<MessageResponse>(`/api/chats/${chatId}/messages`);
  const {data, mutate} = useSWR<ChatRoomResponse>(chatId? `/api/chats/${chatId}` : null,
      {refreshInterval: 1000,
      revalidateOnFocus: true,
      });
  const {data: userData}= useSWR('/api/users/me');
  const lastMessage = data?.chatRoom?.messages[data?.chatRoom?.messages.length - 1];
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
    if(chatId) {
      reset();
    };
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lastMessage]);
  };
  
  return (
    <Layout canGoBack hasTabBar>
      <div className="py-10 pb-16 px-4 space-y-4">
        <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" />
        <form className="fixed py-2 bg-white  bottom-0 inset-x-0">
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;