"use client";

/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pen, BookOpen, Users, FileText, Settings, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Journal } from "@/lib/api";

const IPFS_GATEWAY = "https://pub.desci.com/ipfs";

interface JournalProps {
  journal: Journal;
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

function MarkdownContent({ content }: { content: string | null }) {
  if (!content) return <span className="text-sm text-muted-foreground italic">Not set</span>;
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
      {content}
    </div>
  );
}

export default function JournalDetails({ journal }: JournalProps) {
  const router = useRouter();

  const imageUrl = journal.imageUrl
    ? journal.imageUrl
    : journal.iconCid
      ? `${IPFS_GATEWAY}/${journal.iconCid}`
      : null;

  const publicationCount = journal.submissions?.length ?? 0;

  return (
    <div className="container mx-auto pt-4 pb-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex items-start justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={journal.name}
                  className="w-full max-w-[200px] h-auto rounded-lg object-contain"
                />
              ) : (
                <div className="w-full max-w-[200px] h-32 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="md:w-3/4 space-y-3">
              <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">{journal.name}</h1>
                  {journal.slug && (
                    <p className="text-sm text-muted-foreground font-mono">/{journal.slug}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push(`${journal.id}/edit`)}
                >
                  <Pen className="w-4 h-4" />
                  Edit
                </Button>
              </div>
              <p className="text-muted-foreground">{journal.description}</p>
              <div className="flex gap-3 pt-2">
                <Badge variant="secondary">
                  {publicationCount} publication{publicationCount !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline">ID: {journal.id}</Badge>
                {journal.settings?.refereeCount && (
                  <Badge variant="outline">
                    {journal.settings.refereeCount.value} referee{journal.settings.refereeCount.value !== 1 ? "s" : ""} per submission
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Journal Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <DetailField label="Created">
                {new Date(journal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DetailField>
              <DetailField label="Slug">
                {journal.slug ? (
                  <code className="text-sm bg-muted px-2 py-0.5 rounded">{journal.slug}</code>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Not set</span>
                )}
              </DetailField>
              <DetailField label="Default Data License">
                {journal.settings?.defaultDataLicense ?? (
                  <span className="text-sm text-muted-foreground italic">Not set</span>
                )}
              </DetailField>
              <DetailField label="Default Code License">
                {journal.settings?.defaultCodeLicense ?? (
                  <span className="text-sm text-muted-foreground italic">Not set</span>
                )}
              </DetailField>
            </dl>
          </CardContent>
        </Card>

        {/* Review Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Review Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <DetailField label="Referees per Submission">
                {journal.settings?.refereeCount?.value ?? "N/A"}
              </DetailField>
              {journal.settings?.reviewDueHours && (
                <DetailField label="Review Due (hours)">
                  <div className="flex gap-4 text-sm">
                    <span>Min: <strong>{journal.settings.reviewDueHours.min}</strong></span>
                    <span>Default: <strong>{journal.settings.reviewDueHours.default}</strong></span>
                    <span>Max: <strong>{journal.settings.reviewDueHours.max}</strong></span>
                  </div>
                </DetailField>
              )}
              {journal.settings?.refereeInviteExpiryHours && (
                <DetailField label="Referee Invite Expiry (hours)">
                  <div className="flex gap-4 text-sm">
                    <span>Min: <strong>{journal.settings.refereeInviteExpiryHours.min}</strong></span>
                    <span>Default: <strong>{journal.settings.refereeInviteExpiryHours.default}</strong></span>
                    <span>Max: <strong>{journal.settings.refereeInviteExpiryHours.max}</strong></span>
                  </div>
                </DetailField>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* About Article */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-4 h-4" />
            About Article
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent content={journal.aboutArticle} />
        </CardContent>
      </Card>

      {/* Editorial Board Article */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            Editorial Board Article
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent content={journal.editorialBoardArticle} />
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Instructions for Authors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownContent content={journal.authorInstruction} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Instructions for Referees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownContent content={journal.refereeInstruction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
