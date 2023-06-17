import { useNavigate } from "react-router-dom"
import {
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageInput,
  MessageList,
  ChannelHeader,
  Thread,
  ChannelPreviewUIComponentProps,  
  Avatar,
  useChannelStateContext,
  ChannelHeaderProps,
  InfiniteScroll,
} from "stream-chat-react"
import { ChannelListMessengerProps } from "stream-chat-react/dist/components"
import { useChatContext } from "stream-chat-react/dist/context"
import { Button } from "../components/Button"
//import '@stream-io/stream-chat-css/dist/v2/css/index.css';


import { useLoggedInAuth } from "../context/AuthContext"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'

import { ChannelMembers} from "./ChannelMembers"

let sentNotifications : string[] = [];

export function Home() {  
  const urlParams = new URLSearchParams(window.location.search);
  const { user, streamChat  } = useLoggedInAuth()
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const theme = urlParams.get('theme') || 'light';
  const sort = { last_message_at: -1 } as const;
  
  
 /* useEffect(() => {
    channel.on( event => {      
      if (event.type === 'message.new' && event.unread_count! > 0) { 
        const notification = new Notification(event.user?.name!, {
          body: event.message?.text,                    
        })   
      }
    });
  }, []);*/

  if (streamChat == null) return <LoadingIndicator />
   
  
  /*if (!(
    window.Notification &&
    (Notification.permission === 'granted' ||
      Notification.permission === 'denied')
  ))*/
  if (Notification.permission === 'default')
    {      
    if (!showNotificationBanner)
    setShowNotificationBanner(true);   }

    function grantPermission() {        
      if (Notification.permission === 'granted') {      
        toast.success('You are already subscribed to web notifications');
        return;
      }
      
      if (
        Notification.permission === "denied" ||
        Notification.permission === "default"
      ) {
        Notification.requestPermission().then(result => {
          if (result === 'granted') {
            window.location.reload();
            new Notification('New message from PFS', {
              body: 'Nice, notifications are now enabled!',
            });
          }
        });
      }
      setShowNotificationBanner(false);
    }

    
  return (             
    <Chat client={streamChat}  >                            
      {showNotificationBanner && (
        <div className="alert">
          <p>
            Prithibi needs your permission to&nbsp;
            <button onClick={grantPermission}>
              enable desktop notifications
            </button>
          </p>
        </div>
      )}     
      <ChannelList       
        List={Channels}
        sort={sort}
        sendChannelsToList               
        filters={ {$and: [{ members: { $in: [user.id] } },{ teams: {}  }]}}     
      />      
      <Channel>
        <Window>        
          <CustomChannelHeader />        
          <MessageList />        
          <MessageInput />        
        </Window>        
        <Thread />        
      </Channel>       
    </Chat>    
  )
}




function CustomChannelHeader  (props: ChannelHeaderProps) {
  const { title } = props;
  const navigate = useNavigate()

  const { channel, watcher_count } = useChannelStateContext();
  const { name } = channel.data || {};  
  const { client } = useChatContext();
  const  user2 = useLoggedInAuth();
  
            

  const getWatcherText = (watchers: number | undefined) => {
    if (!watchers) return 'No users online';
    if (watchers === 1) return (channel?.data?.type==="team" ?'1 online' : 'Offline');
    if (watchers === 2) return (channel?.data?.type==="team" ?'2 online' : 'Online');
    return `${watchers} online`;
  };

  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(!clicked);
  };

  
 if (channel?.data?.type==="team") {
    let members = Object.values(channel.state.members)
    
    return (
      <div className='str-chat__header-livestream'>
        <div className="block">
        <div>
        <button
            className="flex"
            onClick={handleClick}
        >
            <div>
                <img
                  src="/assets/icons8-hashtags-64.png"
                        className="w-10 h-10 rounded-full object-center object-cover bg-blue-200"
                />           
            </div>
            <div className="pl-2 block">
                <div className="block text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                      {title || name}               
                </div>   
                <div className='block text-sm'>
                    <p>{members.length} members, {getWatcherText(watcher_count)}</p>
                </div> 
            </div>
        </button>
        </div>
        {clicked && (
           <div className="text-sm pt-2">
              <ul >
                <li className="font-bold flex">Channel Members:</li>
                {members.map((member) => (
                  <li key={member?.user?.name}>                   
                  <span>{(member?.user?.fullName || member?.user?.name) as string} - </span>
                  <span className = {member?.user?.online ? "text-green-600" : "text-red-500"}>{member?.user?.online ? 'Online' : 'Offline'}</span>                  
          </li>
        ))}
      </ul>   

           </div>
        )
        }
        </div>
      </div>
    );
 }
 else {
    let channelName = channel.data?.name
    let imageSource = "";
           
    
    let members = Object.values(channel.state.members).filter(({ user }) => user?.id !== client?.user?.id)
    
    channelName =  members[0]?.user?.fullName as string || members[0]?.user?.name || members[0]?.user?.id as string
    imageSource = members[0]?.user?.image as string;
           

  return (
    <div className='str-chat__header-livestream'>
      <div
        className="inline-flex flex-row items-center"
      ><div>
      
                  <img
                    src={imageSource || "/assets/icons8-customer-32.png"}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                </div>
                 <div className='pl-2'>
                <div className="text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {channelName! || channel.id!}                  
                </div>   
        <div className='text-sm'>
          <p >{getWatcherText(watcher_count)}</p>
        </div> </div>
    </div>
    </div>
  );
 }
};

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate()
  const { logout } = useLoggedInAuth()
  const { setActiveChannel, channel: activeChannel } = useChatContext()
  const { user, streamChat } = useLoggedInAuth()
 
    
  return (    
    <div className="w-65 flex flex-col gap-2 mt-3 h-full ">
      <div className="w-65 boder-none flex flex-col gap-2 m-0 pl-3 pr-3" >      
        <div className="w-65 boder-none flex flex-col gap-2 mb-2 float-left inline-block">
          <button 
             disabled
          >
            <img src="/assets/favicon.png" alt="Logo" className="w-16 h-16 float-left inline-block"/>
          <p className="ml-2 mt-2 float-left inline-block site-identity">Prithibi Consulting and  
          <br/>Development Services</p>
          </button>
        </div>       
      <Button          
          onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      </div>      
      <div className="mt-0 mb-3 w-full flex flex-col  h-full items-center channel-list-container ">
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            let extraClasses = ""
            if (channel.state.unreadCount > 0) {
               extraClasses = "hover:bg-blue-100 bg-yellow-100"
            }
            else {
               extraClasses = isActive
              ? "bg-blue-500 text-white "
              : "hover:bg-blue-100 bg-gray-100"  
            }
            let channelName : string = "";
            let imageSource : string = "";
           // console.log(channel)
           const user2 = user;
           const members = Object.values(channel.state.members).filter(({ user }) => user?.id !== user2.id)
           if (channel?.data?.type==="team") {       
              channelName = channel.data.name!;
              imageSource = "/assets/icons8-hashtags-64.png"
           }
           else {
              channelName = (members[0]?.user?.fullName || members[0]?.user?.name || members[0]?.user?.id || "Unknown") as string;              
              imageSource = members[0]?.user?.image || "/assets/icons8-customer-plain-32.png";
           }
           
           const { messages } = channel.state;          
           let messagePreview = messages[messages.length - 1]?.text?.slice(0, 30);           
           
           if ((messages[messages.length - 1]?.attachments!.length > 0) &&  (messagePreview===""))
             messagePreview = "Attachment...";
             
            let unreadCount : string = ""; 
            if (channel.state.unreadCount > 0){
               unreadCount = channel.state.unreadCount.toString();                              
            }
            
            //&& channel.state.unreadCount > 0

            channel.on( event => {      
              if (event.type === 'message.new' ) { 
                const existingNotification = window.Notification && window.Notification.permission === "granted"
              ? window.navigator.serviceWorker.getRegistration().then(registration => {
                  return registration?.getNotifications({ tag: event.message?.id });
                })
              : Promise.resolve([]);
            
            existingNotification.then(notifications => {
                if (notifications && notifications.length > 0) {
                  // close notification
                 // notifications[0].close();                                    
                }                 
                else {
                  // Create a new notification
                  const notification = new Notification(event.user?.name!, {
                    body: event.message?.text, 
                    icon: "./public/assets/favicon.png",
                    tag: event.message?.id
                  })   
                }
              });  

                
              }
            });
                                                                
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}                
                className={`w-full p-2 grid grid-cols-12 items-center border-b border-gray-50 ${extraClasses}`} 
                key={channel.id}                
              >
              {imageSource && (
                  <img
                    src={imageSource}
                    className="w-10 h-10 rounded-full object-center object-cover col-span-2"
                  />
                )}
                 
                <div className="pl-2 text-left text-ellipsis overflow-hidden whitespace-nowrap col-span-10 ">
                  <p className="font-bold text-sm">{channelName || channel.id}</p>
                  <p className="text-xs">{messagePreview}</p>                  
                </div> 
                               
              </button>
            )
          })
        : "No Conversations"}
      <hr className="border-gray-500 mt-auto" />
      <div className="w-11/12 mt-1 mb-1">
        <Button                 
                onClick={() => navigate("/logout")} disabled={logout.isLoading}>
          Logout
        </Button>
        </div>
      
</div>
   </div>
  )
}
