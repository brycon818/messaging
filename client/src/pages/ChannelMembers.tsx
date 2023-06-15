import React, { useEffect, useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';


export function ChannelMembers ()  {
    const { channel } = useChannelStateContext();
    const { client } = useChatContext(); 
    const [channelUsers, setChannelUsers] = useState<Array<{ name: string; online: boolean }>>([]);

  
    useEffect(() => {
      const updateChannelUsers = () => {
        setChannelUsers(
          Object.values(channel.state.members).map((user) => ({            
            name: user.user_id!,
            online: !!user.user!.online,
          })),
        );
      };
  
      updateChannelUsers();
    }, [client, channel]);
  
    return (        
      <ul className='users-list'>
        {channelUsers.map((member) => (
          <li key={member.name}>
            {member.name} - {member.online ? 'online' : 'offline'}
          </li>
        ))}
      </ul>       
    );
  };