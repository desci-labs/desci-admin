"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X, Settings } from "lucide-react";
import { addMember, Community, removeMember, searchUsers } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";

type User = {
  id: number;
  name: string;
  organisations: string[];
};

export default function CommunityMembers({
  community,
}: {
  community: Community;
}) {
  const queryClient = getQueryClient();

  const members = community.CommunityMember;
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const addMemberMutation = useMutation(
    {
      mutationFn: addMember,
    },
    queryClient
  );
  const removeMemberMutation = useMutation(
    {
      mutationFn: removeMember,
    },
    queryClient
  );

  const toggleMember = async (user: Pick<User, "id">) => {
    const existingMember = members.find((m) => m.userId === user.id);
    if (existingMember) {
      removeMemberMutation.mutate(
        {
          communityId: community.id,
          memberId: existingMember.id,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: [tags.communities] });
            removeMemberMutation.reset();
          },
        }
      );
    } else {
      addMemberMutation.mutate(
        { communityId: community.id, userId: user.id, role: "MEMBER" },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: [tags.communities] });
          },
        }
      );
    }
  };

  const { mutate } = useMutation(
    {
      mutationKey: [tags.users],
      mutationFn: searchUsers,
    },
    queryClient
  );

  useEffect(() => {
    mutate(
      { name: search.trim() },
      {
        onSuccess(data, variables, context) {
          console.log("Results", { data, variables, context });
          if (data?.length > 0)
            setUsers(data.filter((user) => user.name !== null) ?? []);
        },
      }
    );
  }, [search, mutate]);

  //   const isPending =
  //     addMemberMutation.isPending || removeMemberMutation.isPending;

  console.log("Users", users);
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            {community.CommunityMember?.length ?? "No"} members
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[555px]">
            <DialogHeader>
              <DialogTitle>Manage Members</DialogTitle>
            </DialogHeader>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search users..."
                onValueChange={(search) => setSearch(search)}
              />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users?.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => toggleMember(user)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/avatars/01.png" alt="Avatar" />
                          <AvatarFallback>{getNameTag(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          {/* {user.organisations.length > 0 && ( */}
                          <p className="text-xs text-muted-foreground">
                            {/* {user.organisations[0]} */}
                            Massachusetts Institute of Technology
                          </p>
                          {/* )} */}
                        </div>
                      </div>
                      {members.some((m) => m.userId === user.id) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{getNameTag(member.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  toggleMember({
                    id: member.userId,
                    // name: member.user.name,
                  })
                }
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove member</span>
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

const getNameTag = (name: string) => {
  const split = name.split(" ");
  return (split[0]?.[0] ?? "") + (split?.[1]?.[0] ?? "");
};
