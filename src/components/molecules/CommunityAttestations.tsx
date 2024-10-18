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
import { Check, X, Award, Plus, Settings, Lock, Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addEntryAttestation,
  attestationQueryOptions,
  Community,
  listAttestationsQuery,
  removeEntryAttestation,
} from "@/lib/api";
import Link from "next/link";
import { buttonVariants } from "../custom/LoaderButton";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

export default function CommunityAttestations({
  community,
}: {
  community: Community;
}) {
  const [attestationOpen, setAttestationOpen] = useState(false);

  const {
    data: attestations,
    isLoading,
    isError,
    refetch: refetchCommunityAttestations,
  } = useQuery(attestationQueryOptions(community.id));
  const { data: allAttestations, refetch: refetchAttestations } =
    useSuspenseQuery(listAttestationsQuery);

  const addEntryMutation = useMutation({ mutationFn: addEntryAttestation });
  const removeEntryMutation = useMutation({
    mutationFn: removeEntryAttestation,
  });

  const toggleEntryAttestation = (id: number) => {
    if (!attestations) return;
    const isExisting =
      attestations.find(
        (att) =>
          att.id === id &&
          att.isRequired &&
          att.entryAttestationId !== undefined
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

  const isPending = addEntryMutation.isPending || removeEntryMutation.isPending;
  const hasError = addEntryMutation.isError || removeEntryMutation.isError;
  const error = addEntryMutation.error || removeEntryMutation.error;

  console.log("states", { isPending, hasError, error });

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
                          (a) => a.id === attestation.id && a.isRequired
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
                  </div>
                  <p className="font-light text-muted-foreground text-sm">
                    By {attestation.communityName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                
                {attestation.isRequired && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      toggleEntryAttestation(attestation.attestationId)
                    }
                  >
                    <X className="h-4 w-4 text-error" />
                    <span className="sr-only">Remove attestation</span>
                  </Button>
                )}
                {!attestation.isExternal && (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={`${attestation.communityId}/attestations/${attestation.attestationId}/edit`}
                  >
                    <Pen className="h-4 w-4" />
                    <span className="sr-only">Edit attestation</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
