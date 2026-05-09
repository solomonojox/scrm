import React from 'react'
import MessagesCards from '../component/chapter-admin/messages/MessagesCards'
import MessageHistory from '../component/chapter-admin/messages/MessageHistory'

const NappsChapterMessages = () => {
    return (
        <div className='space-y-4'>
            <div>
                <p className="font-bold text-2xl">Messages</p>
                <p className="text-gray-500">Send announcements to schools in FCT</p>
            </div>

            <MessagesCards />

            <MessageHistory />
        </div>
    )
}

export default NappsChapterMessages