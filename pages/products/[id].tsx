import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import ProfileInfo from "@components/profile";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User, ChatRoom } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";
import timeForToday from "@libs/client/timeForToday";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface MessageResponse {
  ok: boolean;
  chatRoom: ChatRoom;
  isChatRoom?: ChatRoom;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const {user, isLoading} = useUser();
  const router = useRouter();
  const {mutate} = useSWRConfig();
  const { id } = router.query;
  const { data, mutate:boundMutate } = useSWR<ItemDetailResponse>(
    id ? `/api/products/${id}` : null
  );
  const { data: userData } = useSWR(`/api/users/me`);
  const [toggleFav] = useMutation(`/api/products/${id}/fav`);
  const onFavoriteClick = () => {
    if (!data) return;
    boundMutate (prev=> prev&& ({...prev, isLiked: !prev.isLiked}), false);
    // unbound mutate (다른 화면의 데이터를 변경하길 원할때)
    // mutate("/api/users/me", (prev:any) =>({ok: !prev.ok}), false)
    toggleFav({});
  }
  const { handleSubmit } = useForm();
  const [send, { data: chatRoomData, loading }] =
    useMutation<MessageResponse>("/api/chats");
  const onVaild = () => {
    send(id);
  };
  useEffect(() => {
    if (chatRoomData && chatRoomData?.chatRoom) {
      router.push(`/chats/${chatRoomData.chatRoom?.id}`);
    } else if (chatRoomData?.isChatRoom) {
      router.push(`/chats/${chatRoomData.isChatRoom?.id}`);
    }
  }, [chatRoomData, router]);

  return (
    <Layout canGoBack seoTitle="Product Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
          <Image
            src={`https://imagedelivery.net/jSdjqPvKO6f21nrvGjwl4w/${product?.image}/public`}
            className=" bg-slate-300 object-cover"
            layout="fill"
          />
          </div>
          <div className="flex justify-between items-center content-center">
            <ProfileInfo
              big
              subtitle={timeForToday(data?.product?.createdAt)}
              name={data?.product?.user?.name}
              id={data?.product?.user?.id}
              avatar={data?.product?.user?.avatar}
              position={"mt-8"}
            />
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name || <Skeleton width={200} />}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ${product?.price || <Skeleton width={100} />}
            </span>
            <p className=" my-6 text-gray-700">{product?.description || <Skeleton/>}</p>
            </div>
          
          <div className="mt-5">
       
            <div className="flex items-center justify-between space-x-2">
            <form className="w-full" onSubmit={handleSubmit(onVaild)}>
                <Button
                  large
                  text={loading ? "Loading...." : "Talk to seller"}
                  mine={
                    userData?.profile?.id === data?.product?.userId
                      ? true
                      : false
                  }
                />
              </form>
              <button onClick={onFavoriteClick} 
              className={cls(
                "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ",
                data?.isLiked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:bg-gray-500"
              )}
              >
                {data?.isLiked?(
                        <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                        <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                          ></path>
                        </svg>) : (
                        <svg
                          className="h-6 w-6 "
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                        <path
                         strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>)}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product) => (
              <div key={product.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths =() => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps : GetStaticProps = async(ctx) => {
  if(!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where:{ 
     id: +ctx.params.id.toString(),
    },
    include:{
      user: {
         select:{
             id:true,
             name:true,
             avatar:true,
         }
     },
 }
 });
 const terms = product?.name.split(" ").map((word)=>({
     name:{
         contains: word,
     }
 }));
 const relatedProducts = await client.product.findMany({

     where: {
         OR: terms,
         AND:{
             id:{
                 not: product?.id,
             }
         }
     },
 });
 const isLiked = false
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked: JSON.parse(JSON.stringify(isLiked)),
    },
  };
};

export default ItemDetail;