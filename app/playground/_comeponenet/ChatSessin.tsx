import { Button } from '@/components/ui/button'
import { Message } from '../[projectid]/page'
import { ArrowUp, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type props = {
  message: Message[]
  onSend: any
  loading: boolean
}

const ChatSessin = ({ message, onSend, loading }: props) => {
  const [inputValue, setvalue] = useState<string>("")

  // 👇 Log message data whenever it changes
  useEffect(() => {
    console.log("🧠 Chat Messages Updated:", message)
  }, [message])

  const handelSend = () => {
    if (!inputValue?.trim()) return
    onSend(inputValue)
    setvalue("")
  }

  return (
    <div className='w-[370px] h-[90vh] shadow-2xl p-1 flex flex-col gap-2'>
      <div className='flex flex-col gap-3 flex-1 overflow-y-auto p-4'>
        {message.length === 0 ? (
          <h1>No message yet</h1>
        ) : (
          message.map((item, i) => (
            <div
              key={i}
              className={`${item.role === "user" ? "flex justify-end text-start" : "flex justify-start"} w-full`}
            >
              <div
                className={`max-w-[80%] p-2.5 shadow-xs rounded-2xl ${
                  item.role === "user"
                    ? "text-black bg-gray-200"
                    : "text-black bg-gray-100"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className='p-4 flex justify-center items-center gap-2 rounded-lg border bg-secondary'>
            <Loader2 className='animate-spin' />
            <span>Loading...</span>
          </div>
        )}
      </div>

      <div className='p-2 border-t w-full flex items-center gap-2'>
        <textarea
          value={inputValue}
          onChange={(e) => setvalue(e.target.value)}
          placeholder='Describe your website design idea'
          className='px-3 py-2 resize-none border rounded-lg focus:outline-none focus:ring-2 w-full'
        />
        <Button onClick={handelSend}><ArrowUp />
        </Button>
      </div>
    </div>
  )
}

export default ChatSessin
