
import { Chat } from "@/components/custom/chat"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { generateUUID } from "@/lib/utils"

import { AppSidebar } from "../../components/custom/app-sidebar"

export default function Page() {
  const id = generateUUID()

  return (
    <div className="flex flex-col gap-4 p-4">
      <Chat key={id} id={id} initialMessages={[]} />
    </div>
  )
}
