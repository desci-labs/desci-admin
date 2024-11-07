/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, Award, Plus, Settings, Lock, Pen } from "lucide-react";
import { RxAccessibility } from "react-icons/rx";
import { cn } from "@/lib/utils";
import {
  addEntryAttestation,
  attestationQueryOptions,
  Community,
  listAttestationsQuery,
  removeEntryAttestation,
  toggleEntryAttestationRequirement,
} from "@/lib/api";
import Link from "next/link";
import { buttonVariants, LoaderButton } from "../custom/LoaderButton";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function CommunityAttestations({
  community,
}: {
  community: Community;
}) {
  const router = useRouter();
  const [attestationOpen, setAttestationOpen] = useState(false);

  const { data: attestations, refetch: refetchCommunityAttestations } =
    useQuery(attestationQueryOptions(community.id));
  const { data: allAttestations, refetch: refetchAttestations } =
    useSuspenseQuery(listAttestationsQuery);

  const addEntryMutation = useMutation({ mutationFn: addEntryAttestation });
  const removeEntryMutation = useMutation({
    mutationFn: removeEntryAttestation,
  });
  const toggleEntryMutation = useMutation({
    mutationFn: toggleEntryAttestationRequirement,
  });

  const toggleEntryAttestation = (id: number) => {
    if (!attestations) return;
    const isExisting =
      attestations.find(
        (att) => att.id === id && att.entryAttestationId !== undefined
      ) !== undefined;

    if (isExisting) {
      removeEntryMutation.mutate(
        {
          communityId: community.id,
          attestationId: id,
        },
        {
          onSuccess(data, variables, context) {
            refetchAttestations();
            refetchCommunityAttestations();
          },
        }
      );
    } else {
      addEntryMutation.mutate(
        { communityId: community.id, attestationId: id },
        {
          onSuccess(data, variables, context) {
            refetchAttestations();
            refetchCommunityAttestations();
          },
        }
      );
    }
  };

  const toggleEntryRequirement = (id: number) => {
    if (!attestations) return;
    const entryAttestation = attestations.find(
      (att) => att.attestationId === id && att.entryAttestationId !== undefined
    );

    if (entryAttestation?.entryAttestationId) {
      toggleEntryMutation.mutate(
        {
          communityId: community.id,
          entryId: entryAttestation.entryAttestationId,
        },
        {
          onSuccess() {
            refetchAttestations();
            refetchCommunityAttestations();
          },
        }
      );
    }
  };

  const isPending = addEntryMutation.isPending || removeEntryMutation.isPending;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attestations</CardTitle>
        <div className="flex gap-2">
          <Link
            href={`${community.id}/attestations/new`}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
          <Dialog open={attestationOpen} onOpenChange={setAttestationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Manage Attestations</DialogTitle>
              </DialogHeader>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search attestations..." />
                <CommandList>
                  <CommandEmpty>No attestations found.</CommandEmpty>
                  <CommandGroup>
                    {allAttestations.map((attestation) => (
                      <CommandItem
                        key={attestation.id}
                        onSelect={() => toggleEntryAttestation(attestation.id)}
                        className="flex items-center justify-between"
                        disabled={isPending}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage
                              src={attestation.image_url}
                              alt={attestation.name}
                            />
                            <AvatarFallback>
                              <Award className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="mr-1">{attestation.name}</span>
                          {attestation.protected && (
                            <Lock className="h-3 w-3" />
                          )}
                        </div>
                        {attestations?.some(
                          (a) => a.attestationId === attestation.id
                        ) && <Check className="h-4 w-4 text-green-600" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {attestations?.map((attestation) => (
            <div
              key={attestation.id}
              className="flex items-center justify-between gap-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={attestation.imageUrl}
                    alt={attestation.name}
                  />
                  <AvatarFallback>
                    <Award className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-start gap-1">
                    <p className="font-medium">{attestation.name}</p>
                    {attestation.protected && <Lock className="h-3 w-3" />}
                    {attestation.isRequired && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <RxAccessibility className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This attestation is required strictly required to
                              join the community
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="font-light text-muted-foreground text-sm">
                    By {attestation.communityName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <LoaderButton
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                      <DotsHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </LoaderButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `${attestation.communityId}/attestations/${attestation.attestationId}/edit`
                        )
                      }
                    >
                      <span>Edit</span>
                      <span className="sr-only">Edit</span>
                    </DropdownMenuItem>
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          toggleEntryAttestation(attestation.attestationId)
                        }
                      >
                        {attestation.entryAttestationId ? (
                          <span>
                            {attestation.communityName === community.name
                              ? "Remove from entry"
                              : "Delete"}
                          </span>
                        ) : (
                          <span>Add to Entry</span>
                        )}
                      </DropdownMenuItem>
                    </>
                    {attestation.entryAttestationId && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            toggleEntryRequirement(attestation.attestationId)
                          }
                        >
                          {attestation.isRequired
                            ? "Mark as Optional"
                            : "Mark as required"}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
