import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Client, getDataSignature } from 'web3-mq';
import type { KeyPairsType, EventTypes } from 'web3-mq';
import { useChatContext } from 'web3-mq-react';

export const getShortAddress = (address = '', num = 5, endNum = 4) => {
  const strLength = address.length;
  return (
    address.substring(0, num) +
    '...' +
    address.substring(strLength - endNum, strLength)
  );
};

export const adminMainKeys = {
  mainPrivateKey:
    'sPDsP3D3upCELZj09bDlfLTdQ7TQbv0UjkX0/TvVBvRwtAiyPRa3zjJqjO7XHyIfb424yH0v65tq+FCiVb+VWN7hUmVk7pCNsF91cb8zDCo=',
  mainPublicKey:
    'bf305d9013d9aeed058e3ae89ab717481f2583a30ef5aca973cfdacb7f13bad3',
  userid: 'user:18aa99e545b8d19e8e79eae6b0f3d2314d76cf9046f746e114c5b3eb',
  walletAddress: '0xec6d78fd4dba4e4c723349b3f21b53d3a9273975',
  password: 'web3mq',
};
export const groupid = 'group:9e3b48cbfd8e8ef1b324f248024d2a463cba2179';

export const LordsChatProvider = (props: {
  fastestUrl: string;
  keys: KeyPairsType;
  init: () => Promise<void>;
  children: React.ReactNode;
}) => {
  const { children, fastestUrl, keys, init } = props;
  const { client, userInfo } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);

  const queryChatList = async () => {
    await client.channel.queryChannels({
      page: 1,
      size: 9999,
    });
  };
  const inviteGroup = async (
    members: string[],
    publicKey: string,
    privateKey: string
  ) => {
    const { userid, walletAddress } = adminMainKeys;
    const timestamp = Date.now();
    const signContent = userid + groupid + timestamp;
    const web3mqSignature = await getDataSignature(privateKey, signContent);
    return await axios.post(
      `${fastestUrl}/api/group_invitation/`,
      {
        web3mq_signature: web3mqSignature,
        userid,
        timestamp,
        groupid,
        members,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'web3mq-request-pubkey': publicKey,
          didkey: `eth:${walletAddress}`,
        },
      }
    );
  };
  const joinLordsChat = useCallback(async () => {
    // 添加管理员
    await client.contact.sendFriend(adminMainKeys.userid, '');
    // 切换管理员
    const expired =
      Number(localStorage.getItem('ADMIN_PUBKEY_EXPIRED_TIMESTAMP')) || '';
    let adminPrivateKey = localStorage.getItem('ADMIN_PRIVATE_KEY') || '';
    let adminPublicKey = localStorage.getItem('ADMIN_PUBLIC_KEY') || '';
    if (
      !adminPrivateKey ||
      !adminPublicKey ||
      !expired ||
      Date.now() > expired
    ) {
      const {
        TempPrivateKey: tempPrivateKey,
        TempPublicKey: tempPublicKey,
        pubkeyExpiredTimestamp,
      } = await Client.register.signMetaMask({
        password: adminMainKeys.password,
        userid: adminMainKeys.userid,
        did_value: adminMainKeys.walletAddress,
        mainPublicKey: adminMainKeys.mainPrivateKey,
        mainPrivateKey: adminMainKeys.mainPrivateKey,
      });
      adminPrivateKey = tempPrivateKey;
      adminPublicKey = tempPublicKey;
      localStorage.setItem('ADMIN_PRIVATE_KEY', tempPrivateKey);
      localStorage.setItem('ADMIN_PUBLIC_KEY', tempPublicKey);
      localStorage.setItem(
        'ADMIN_PUBKEY_EXPIRED_TIMESTAMP',
        String(pubkeyExpiredTimestamp)
      );
    }
    client.keys.userid = adminMainKeys.userid;
    client.keys.PrivateKey = adminPrivateKey;
    await client.contact.operationFriend(keys.userid, 'agree');
    await inviteGroup([keys.userid], adminPublicKey, adminPrivateKey);
    const { defaultName = '' } = userInfo as any;
    const { nickname } = (userInfo as any).web3mqInfo || {};
    const userName = nickname || defaultName || getShortAddress(keys.userid);
    await client.message.sendMessage(
      `Welcome ${userName} to join the Lords chat`,
      groupid
    );
    await init();
    // 切换用户1
    client.keys.userid = keys.userid;
    client.keys.PrivateKey = keys.PrivateKey;
    // 刷新群列表
    const { userid, PrivateKey } = keys;
    const timestamp = Date.now();
    const topicType = 'group';
    const signContent = userid + groupid + topicType + timestamp;
    const web3mqSignature = await getDataSignature(PrivateKey, signContent);
    await axios.post(
      `${fastestUrl}/api/chats/`,
      {
        userid,
        timestamp,
        web3mq_signature: web3mqSignature,
        topic: groupid,
        topic_type: topicType,
        chatid: groupid,
        chat_type: topicType,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'web3mq-request-pubkey': adminPublicKey,
          didkey: `eth:${adminMainKeys.walletAddress}`,
        },
      }
    );
  }, [userInfo, fastestUrl, keys]);

  const getActiveChannel = useCallback(
    async (channelList: any[]) => {
      const lordschat = channelList.find(
        (channel) => channel.chatid === groupid
      );
      if (!lordschat) {
        const chat = {
          avatar_base64: '',
          avatar_url: '',
          chat_name: 'Lords chat',
          chat_type: 'group',
          chatid: groupid,
        };
        await joinLordsChat();
        channelList.push(chat);
        return chat;
      } else {
        return lordschat;
      }
    },
    [joinLordsChat]
  );

  const handleEvent = useCallback(
    async (props: { type: EventTypes }) => {
      const { type } = props;
      const { channelList } = client.channel;
      if (!channelList) {
        return;
      }
      if (type === 'channel.getList') {
        const activeChannel = await getActiveChannel(channelList);
        setLoading(false);
        setChannels(channelList);
        await client.channel.setActiveChannel(activeChannel);
      }
    },
    [joinLordsChat]
  );

  useEffect(() => {
    if (userInfo) {
      setLoading(true);
      queryChatList();
    }
  }, [userInfo]);

  useEffect(() => {
    client.on('contact.getList', handleEvent);
    client.on('channel.getList', handleEvent);
    client.on('channel.updated', handleEvent);
    client.on('channel.activeChange', handleEvent);
    client.on('message.delivered', handleEvent);
    return () => {
      client.off('contact.getList', handleEvent);
      client.off('channel.getList', handleEvent);
      client.off('channel.updated', handleEvent);
      client.off('channel.activeChange', handleEvent);
      client.off('message.delivered', handleEvent);
    };
  }, [handleEvent]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            style={{
              border: '6px solid rgba(97, 94, 240, 1)',
              borderTopColor: 'rgba(97, 94, 240, 0.2)',
              borderRightColor: 'rgba(97, 94, 240, 0.2)',
              borderBottomColor: 'rgba(97, 94, 240, 0.2)',
            }}
            className="relative border-6 rounded-full w-9 h-9 border-purple-400 animate-spin"
          ></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
