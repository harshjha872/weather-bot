"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Sidebar from "./components/Sidebar";
import DataTable from "./components/Datatable";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Trash,
  UserRoundX,
  Divide,
} from "lucide-react";

type bot_users = {
  id: number;
  created_at: Date;
  username: string | null;
  chatId: number;
  first_name: string;
  isSub: boolean;
};

export default function Admins() {
  const [allusers, setAllUsers] = useState([] as Array<bot_users>);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getallusers");
      const allusers = await res.json();
      setAllUsers(allusers.users);
    })();
  }, []);

  const dummy_users: Array<bot_users> = [
    {
      id: 1,
      created_at: new Date(),
      username: "harshjha872",
      chatId: 99999,
      first_name: "Harsh",
      isSub: false,
    },
    {
      id: 2,
      created_at: new Date(),
      username: "satyamx64",
      chatId: 88888,
      first_name: "Satyam",
      isSub: false,
    },
    {
      id: 3,
      created_at: new Date(),
      username: "devansh08",
      chatId: 77777,
      first_name: "Devansh",
      isSub: false,
    },
    {
      id: 4,
      created_at: new Date(),
      username: "kanhaiya_tulsyan",
      chatId: 66666,
      first_name: "Kanhaiya",
      isSub: false,
    },
    {
      id: 5,
      created_at: new Date(),
      username: null,
      chatId: 87878,
      first_name: "Pradeep",
      isSub: false,
    },
  ];

  const columns: ColumnDef<bot_users>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "created_at",
      header: "created_at",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "chatId",
      header: "ChatId",
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "isSub",
      header: "isSub",
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <UserRoundX className="mr-2 h-4 w-4" />
                <span>Unsub</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 hover:text-white">
                <Trash className="mr-2 h-4 w-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="lg:p-8 py-12 w-screen h-screen flex">
      <Sidebar />
      <div className="w-full h-full px-6">
        <div className="font-bold text-3xl">Welcome back king!!</div>
        <div className="pt-1 text-zinc-400">
          Here&apos;s a list of the subs...
        </div>
        <div className="py-6">
          <Suspense fallback={<div> Please Wait... </div>}>
            {allusers.length !== 0 ? (
              <DataTable columns={columns} data={allusers} />
            ) : (
              <div>loading...</div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
