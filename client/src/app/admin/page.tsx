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
import axios from "axios";
import { toast } from "sonner";
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
  UserCheck,
  Divide,
  UserRoundCog,
} from "lucide-react";

type bot_users = {
  id: number;
  created_at: Date;
  username: string | null;
  chatId: number;
  first_name: string;
  isSub: boolean;
  latitude: number;
  longitude: number;
};

export default function Admins() {
  const [allusers, setAllUsers] = useState([] as Array<bot_users>);

  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:8080/getAllUsers");
      const allusers = res.data;
      setAllUsers(allusers);
    })();
  }, []);

  const deleteUser = async (chatId: number) => {
    const allusers1 = [...allusers];
    const updatedUsersData = allusers.filter((user) => user.chatId !== chatId);
    setAllUsers(updatedUsersData);

    const res = await axios.post("http://localhost:8080/deleteUser", {
      chatId: chatId,
    });

    if (res.data.msg !== "User deleted") {
      setAllUsers(allusers1);
    }
    toast(res.data.msg);
  };

  const unsubUser = async (chatId: number) => {
    const allusers1 = [...allusers];
    const updatedUsersData = [...allusers];
    updatedUsersData.forEach((user) => {
      if (user.chatId === chatId) {
        user.isSub = false;
      }
    });
    setAllUsers(updatedUsersData);
    const res = await axios.post("http://localhost:8080/unsubUser", {
      chatId: chatId,
    });
    if (res.data.msg !== "User unsubscribed") {
      setAllUsers(allusers1);
    }
    toast(res.data.msg);
  };

  const makeSub = async (chatId: number) => {
    const allusers1 = [...allusers];
    const updatedUsersData = [...allusers];
    updatedUsersData.forEach((user) => {
      if (user.chatId === chatId) {
        user.isSub = true;
      }
    });
    setAllUsers(updatedUsersData);
    const res = await axios.post("http://localhost:8080/makeSub", {
      chatId: chatId,
    });
    if (res.data.msg === "User subscribed") {
      setAllUsers(allusers1);
    }
    toast(res.data.msg);
  };

  const dummy_users: Array<bot_users> = [
    {
      id: 1,
      created_at: new Date(),
      username: "harshjha872",
      chatId: 99999,
      first_name: "Harsh",
      isSub: false,
      latitude: 1.9746,
      longitude: 77.5929,
    },
    {
      id: 2,
      created_at: new Date(),
      username: "satyamx64",
      chatId: 88888,
      first_name: "Satyam",
      isSub: false,
      latitude: 1.9746,
      longitude: 77.5929,
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
      accessorKey: "latitude",
      header: "Latitude",
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
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
              {row.original.isSub ? (
                <DropdownMenuItem
                  onClick={async () => await unsubUser(row.original.chatId)}
                >
                  <UserRoundX className="mr-2 h-4 w-4" />
                  <span>Unsub</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={async () => await makeSub(row.original.chatId)}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Make sub</span>
                </DropdownMenuItem>
              )}
              {/* <DropdownMenuItem>
                <UserRoundCog className="mr-2 h-4 w-4" />
                <span>Make admin</span>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => await deleteUser(row.original.chatId)}
                className="text-red-500 hover:text-white"
              >
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
