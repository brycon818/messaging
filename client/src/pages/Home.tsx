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

let msgid ='asdf'
let sentNotifications : string[] = [];

export function Home() {  
  
  const { user, streamChat } = useLoggedInAuth()
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  
  if (streamChat == null) return <LoadingIndicator />

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
      <link id="favicon" rel="icon" href="/favicon.ico" />
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
      <div className="w-60 flex flex-col gap-4 m-3">
      <h1 className="text-2xl font-bold mb-8 text-center">Prithibi Field Service</h1>     
      <Button          
          onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      </div>
      <div className="mt-0 w-60 flex flex-col gap-4 m-3 h-full items-center channel-list-container">
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100"  
            let channelName = channel.data?.name
            const regex = new RegExp("\\b" + user.name + "\\b", "g");
            channelName = channelName?.replace(regex, "");

            channelName = channelName?.split(' : ').join("");

            
                                     
              try {
              channel.on( event => {
                 //console.log('event',event)
                 const notifMessage = event.message?.id
            
                 if (event.type === 'message.new' && event.unread_count! > 0) {                  
                 /* // console.log(channel.data?.name)
                  toast.dismiss()
                 toast.success("New Message: " + event.user.name)
                 const sound = new Audio('/assets/sound17.ogg');
                 sound.volume = 0.5
                  sound.play();  */               
                 
                 if (!(sentNotifications.includes(notifMessage!))) {
                    console.log(notifMessage)
                    sentNotifications.push(notifMessage!);  
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
                className={` w-11/12 p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
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
      
</div>
    </div>
  )
}
