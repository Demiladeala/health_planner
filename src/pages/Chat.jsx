import React from 'react'
import Sidebar from '../components/side-bar'
import Layout from '../components/layout'
import ChatPage from '../components/chat-page'

const Chat = () => {
  return (
    <main className="relative container w-full mx-auto max-w-[2800px] overflow-y-auto scroll-smooth">
        <Sidebar/>

        <Layout>
            <ChatPage/> 
        </Layout>
    </main>
  )
}

export default Chat