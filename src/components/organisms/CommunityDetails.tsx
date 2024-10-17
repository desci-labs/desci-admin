/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Check,
  ChevronsUpDown,
  ExternalLink,
  Users,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  X,
  Award,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Community } from "@/lib/api";

type User = {
  id: number;
  name: string;
};

type AttestationVersion = {
  id: number;
  name: string;
  image_url: string;
};

type CommunityProps = {
  community: Community;
  users: User[];
  allAttestations: AttestationVersion[];
};

export default function Component({
  community,
  users,
  allAttestations,
}: CommunityProps) {
  const [open, setOpen] = useState(false);
  const [attestationOpen, setAttestationOpen] = useState(false);
  const [members, setMembers] = useState(() => community.CommunityMember ?? []);
  const [attestations, setAttestations] = useState(
    community.CommunityEntryAttestation
  );

  const toggleMember = (user: User) => {
    setMembers((prevMembers) => {
      const existingMember = prevMembers.find((m) => m.userId === user.id);
      if (existingMember) {
        return prevMembers.filter((m) => m.userId !== user.id);
      } else {
        return [
          ...prevMembers,
          {
            id: Date.now(),
            role: "MEMBER",
            userId: user.id,
            user: { name: user.name, userOrganizations: [] },
          },
        ];
      }
    });
  };

  const toggleAttestation = (attestation: AttestationVersion) => {
    setAttestations((prevAttestations) => {
      const existingAttestation = prevAttestations.find(
        (a) => a.attestationVersion.name === attestation.name
      );
      if (existingAttestation) {
        return prevAttestations.filter(
          (a) => a.attestationVersion.name !== attestation.name
        );
      } else {
        return [
          ...prevAttestations,
          { id: Date.now(), attestationVersion: attestation },
        ];
      }
    });
  };

  const handleCreateNewAttestation = () => {
    // This function would typically open a form to create a new attestation
    console.log("Create new attestation");
  };

  console.log({ users, allAttestations });

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={
                  community.image_url || "/placeholder.svg?height=300&width=400"
                }
                alt={community.name}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">
                {community.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {community.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground">{community.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* attestations section  */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attestations</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateNewAttestation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
                <Dialog
                  open={attestationOpen}
                  onOpenChange={setAttestationOpen}
                >
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
                              onSelect={() => toggleAttestation(attestation)}
                              className="flex items-center justify-between"
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
                                <span>{attestation.name}</span>
                              </div>
                              {attestations.some(
                                (a) =>
                                  a.attestationVersion.name === attestation.name
                              ) ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              )}
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
                {attestations.map((attestation) => (
                  <div
                    key={attestation.id}
                    className="flex items-center justify-between gap-4 mb-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={attestation.attestationVersion.image_url}
                          alt={attestation.attestationVersion.name}
                        />
                        <AvatarFallback>
                          <Award className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {attestation.attestationVersion.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toggleAttestation(attestation.attestationVersion)
                      }
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove attestation</span>
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          {/* attestations section  */}

          {/* Links section  */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {community.links.map((link, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Links section  */}

          {/* other details  */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Community Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Created</dt>
                  <dd className="text-muted-foreground">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Last Updated</dt>
                  <dd className="text-muted-foreground">
                    {new Date(community.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Slug</dt>
                  <dd className="text-muted-foreground">{community.slug}</dd>
                </div>
                <div>
                  <dt className="font-medium">Visibility</dt>
                  <dd className="text-muted-foreground">
                    {community.hidden ? "Hidden" : "Visible"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          {/* other details  */}
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>{members.length} members</CardDescription>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Manage</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Manage Community Members</DialogTitle>
                  </DialogHeader>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users?.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => toggleMember(user)}
                            className="flex items-center justify-between"
                          >
                            <span>{user.name}</span>
                            {members.some((m) => m.userId === user.id) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
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
                        <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toggleMember({
                          id: member.userId,
                          name: member.user.name,
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

          <Card>
            <CardHeader>
              <CardTitle>Engagement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Total Engagements</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <ThumbsUp className="h-6 w-6 text-primary mb-1" />
                      <span className="text-lg font-bold">
                        {community.engagements.reactions}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Reactions
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="h-6 w-6 text-primary mb-1" />
                      <span className="text-lg font-bold">
                        {community.engagements.annotations}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Annotations
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-6 w-6 text-primary mb-1" />
                      <span className="text-lg font-bold">
                        {community.engagements.verifications}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Verifications
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Verified Engagements</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <ThumbsUp className="h-6 w-6 text-green-500 mb-1" />
                      <span className="text-lg font-bold">
                        {community.verifiedEngagements.reactions}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Reactions
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="h-6 w-6 text-green-500 mb-1" />
                      <span className="text-lg font-bold">
                        {community.verifiedEngagements.annotations}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Annotations
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                      <span className="text-lg font-bold">
                        {community.verifiedEngagements.verifications}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Verifications
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
