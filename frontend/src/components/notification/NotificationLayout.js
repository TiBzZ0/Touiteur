"use client"

import Sidebar from "../home/Sidebar"

import NotificationList from "@/components/notification/NotificationList"

const NotificationLayout = () => {

    return (
        <div className="flex min-h-screen bg-[color:var(--background)]">
            <Sidebar />
            <div className="flex-1">
                <NotificationList />
            </div>
        </div>
    );
}

export default NotificationLayout;
