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
} from "stream-chat-react"
import { ChannelListMessengerProps } from "stream-chat-react/dist/components"
import { useChatContext } from "stream-chat-react/dist/context"
import { Button } from "../components/Button"

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
   

let msgid ='asdf'
let sentNotifications : string[] = [];

export function Home() {  
  
  const { user, streamChat } = useLoggedInAuth()
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  
  if (streamChat == null) return <LoadingIndicator />
  console.log(Notification.permission)
  if (!(
    window.Notification &&
    (Notification.permission === 'granted' ||
      Notification.permission === 'denied')
  ))
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
    <Chat client={streamChat}>      
      <ToastContainer />      
      {showNotificationBanner && (
          <div className="alert">
            <p>
              PFS needs your permission to&nbsp;
              <button onClick={grantPermission}>
                enable desktop notifications
              </button>
            </p>
          </div>
        )}
        <ChannelList       
        List={Channels}
        sendChannelsToList               
        filters={{ members: { $in: [user.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>      
    </Chat>
  )
}
  
  
function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate()
  const { logout } = useLoggedInAuth()
  const { setActiveChannel, channel: activeChannel } = useChatContext()
  const { user, streamChat } = useLoggedInAuth()
 
    
  return (
    
    <div className="w-65 flex flex-col gap-4 m-3 h-full">
      <div className="w-65 boder-none flex flex-col gap-2 m-0" >      
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
          onClick={() => navigate("/channel/new")}>{user.name}</Button>
      <hr className="border-gray-500" />
      </div>
      
      <div className="mt-0 w-60 flex flex-col gap-2 m-3 h-full items-center channel-list-container">
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            let extraClasses = ""
            if (channel.state.unreadCount > 0) {
               extraClasses = "hover:bg-blue-100 bg-yellow-100"
            }
            else {
               extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100"  
            }
            let channelName = channel.data?.name
            const regex = new RegExp("\\b" + user.name + "\\b", "g");
            channelName = channelName?.replace(regex, "");
            channelName = channelName?.split(' : ').join("");
            const renderMessageText = () => {
              const lastMessageText = channel.state.messages[channel.state.messages.length - 1].text;
          
              const text = lastMessageText || 'message text';
          
              return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
            };
                                               
              try {
              channel.on( event => {
                 
                 const notifMessage = event.message?.id
            
                 if (event.type === 'message.new' && event.unread_count! > 0) {   
                         
                 /* // console.log(channel.data?.name)
                  toast.dismiss()
                 toast.success("New Message: " + event.user.name)
                 const sound = new Audio('/assets/sound17.ogg');
                 sound.volume = 0.5
                  sound.play();  */   
                 // extraClasses = "hover:bg-blue-100 bg-gray-100"            
                 
                 if (!(sentNotifications.includes(notifMessage!))) {
                    
                    sentNotifications.push(notifMessage!);  
                    toast.dismiss() 
                    toast.success(event.user?.name + " : " + event.message?.text)                 
                   const notification = new Notification(event.user?.name!, {
                        body: event.message?.text,                    
                      })   
                                                     
                    }                                             
      
                //  document.getElementById('favicon').href =
                  //  'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/128x128/bell.png';
                }
      
                //if (event.type === 'message.read' && !event.total_unread_count) {
                 // document.getElementById('favicon').href = '/vite.svg';
                 // }
                
                if (event.type === 'message.read' ) {
                    sentNotifications = []
                    }                      
              });  
            } catch (err) {              
              console.log(err);
              return;
            }
            
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={` w-11/12 p-2 rounded-lg flex gap-3 items-center ${extraClasses}`}
                key={channel.id}
              >
              {channel.data?.image && (
                  <img
                    src={channel.data.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {channelName || channel.id}
                </div>   
              </button>
            )
          })
        : "No Conversations"}
      <hr className="border-gray-500 mt-auto" />
      <Button onClick={() => navigate("/logout")} disabled={logout.isLoading}>
        Logout
      </Button>
</div>
   </div>
  )
}
