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


export function Home() {  
  
  const { user, streamChat } = useLoggedInAuth()
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  
  if (streamChat == null) return <LoadingIndicator />

  
 if (
    window.Notification &&
    (Notification.permission === 'granted' ||
      Notification.permission === 'denied')
  )
    ;
  else
    if (!showNotificationBanner)
    setShowNotificationBanner(true);
  

  function grantPermission() {    
    
    if (Notification.permission === 'granted') {
     // setShowNotificationBanner(false);
     setShowNotificationBanner(true);
      new Notification('You are already subscribed to web notifications');
      return;
    }
    
    if (
      Notification.permission !== 'denied' ||
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().then(result => {
        if (result === 'granted') {
          window.location.reload();
          new Notification('New message from Stream', {
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
          <div class="alert">
            <p>
              Stream needs your permission to&nbsp;
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

  
  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <h1 className="text-2xl font-bold mb-8 text-center">Prithibi Field Service</h1>     
      <Button          
          onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100"
              
              try {
              channel.on(event => {
                if (event.type === 'message.new' && event.unread_count > 0) {
                  console.log(channel.data?.name)
                  toast.dismiss()
                  toast.success("New Message: " + channel.data?.name)
                  const sound = new Audio('../sound17.ogg');
                  sound.play();
                  const sound2 = new Audio('./sound17.ogg');
                  sound2.play();
                  const notification = new Notification(event.user.name, {
                    body: event.message.text,                    
                  })                  
      
                //  document.getElementById('favicon').href =
                //    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/223/bell_1f514.png';
                }
      
              //  if (event.type === 'message.read' && !event.total_unread_count) {
                //  document.getElementById('favicon').href = '/favicon.ico';
               // }
              });  
            } catch (err) {
              console.log("Bryan")
              console.log(err);
              return;
            }
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
                key={channel.id}
              >
                {channel.data?.image && (
                  <img
                    src={channel.data.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {channel.data?.name || channel.id}
                </div>
              </button>
            )
          })
        : "No Conversations"}
      

    </div>
  )
}
