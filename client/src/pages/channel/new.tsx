import { useMutation, useQuery } from "@tanstack/react-query"
import { FormEvent, useRef } from "react"
import { Button } from "../../components/Button"
import { FullScreenCard } from "../../components/FullScreenCard"
import { Input } from "../../components/Input"
import { Link } from "../../components/Link"
import Select, { SelectInstance } from "react-select"
import { useLoggedInAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { ThreadIcon } from "stream-chat-react"

export function NewChannel() {
  const { streamChat, user } = useLoggedInAuth()
  const navigate = useNavigate()
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,     
      channelType
    }: {
      name: string
      memberIds: string[]      
      channelType:string
    }) => {
      if (streamChat == null) throw Error("Not connected")
      console.log(channelType)
      return streamChat
        .channel(channelType, name.replace(/\s/g, '-').replace(":", ""), {
          name,         
          members: [user.id, ...memberIds]          
        })
        .watch()
    },
    onSuccess() {
      navigate("/")
    },
  })
  const nameRef = useRef<HTMLInputElement>(null)
  
  const memberIdsRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null)

  const users = useQuery({
    queryKey: ["stream", "users"],
    queryFn: () =>
      streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
    enabled: streamChat != null,
  })
  const isAdmin = (user.role=="admin") 
  
  function handleSubmit(e: FormEvent) {
    e.preventDefault()    

    let name = nameRef.current?.value
    
    const selectOptions = memberIdsRef.current?.getValue()
    const isAdmin = (user.role=="admin") 
    const memberIds: string[] = selectOptions!.map(option => option.value)   
    let channelType = "messaging"    
        
    //if (!isAdmin) 
      // name = memberIds[0] + ' : ' + user.name
    
    if (memberIds.length > 1)
       channelType = "team"  
       
    if (name==null || name==="")
        name = memberIds[0] + ' : ' + user.name       

    if (
      name == null ||
      name === "" ||
      selectOptions == null ||
      selectOptions.length === 0
    ) {
      return
    }
    
    createChannel.mutate({
      name,      
      memberIds: selectOptions.map(option => option.value),
      channelType
    })
  }
 
  
  /*async function asyncwrap(pName) {
    const filter = { type: 'messaging', name: { $eq: pName } };
    const sort = [{ last_message_at: -1 }];
    const { streamChat, user } = useLoggedInAuth()

    const channels = await streamChat.queryChannels(filter, sort, {
    watch: true, // this is the default
    state: true,
  });

    channels.map((channel) => {
        console.log(channel.data.name, channel.cid)
    })
   
   }*/
  
 
  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <h1 className="text-3xl font-bold mb-8 text-center">
          New Conversation
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
        >
          {isAdmin && <label htmlFor="name">Name</label>}
          {isAdmin && <Input id="name" ref={nameRef} />}          
          <label htmlFor="members">Members</label>      
          {isAdmin &&          
          <Select
            ref={memberIdsRef}
            id="members"
            required
            isMulti
            classNames={{ container: () => "w-full" }}
            isLoading={users.isLoading}
            options={users.data?.users.map(user => {
              return { value: user.id, label: user.name || user.id }
            })}
          />  }
           {!isAdmin &&          
          <Select
            ref={memberIdsRef}
            id="members"
            required            
            classNames={{ container: () => "w-full" }}
            isLoading={users.isLoading}
            options={users.data?.users.map(user => {
              return { value: user.id, label: user.name || user.id }
            })}
          />  }         
         
          <Button
            disabled={createChannel.isLoading}
            type="submit"
            className="col-span-full"
          >
            {createChannel.isLoading ? "Loading.." : "Create"}
          </Button>
        
         </form>                                     
        
      </FullScreenCard.Body>
      <FullScreenCard.BelowCard>
        <Link to="/">Back</Link>
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  )
}
