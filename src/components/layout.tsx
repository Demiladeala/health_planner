import React from "react"
import { Toaster } from "react-hot-toast"

const Layout = ( {children, noPadding }) => {
  return (
    <div className="relative w-full lg:w-[84%] flex ml-auto lg:justify-end">
        <Toaster />
        <div className={`w-full lg:w-[80%] border-2 border-dotted overflow-x-hidden mx-auto 
        flex bg-white text-primary-black h-screen 
        ${noPadding ? "" : "pt-8 lg:pt-0"} overflow-y-auto`}>
            <div className={`${noPadding ? "w-full" : "w-full mx-auto pb-16"}`}>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Layout