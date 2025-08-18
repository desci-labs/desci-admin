"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  Pen,
} from "lucide-react";
import ExpandableMarkdown from "@/components/molecules/ExpandableMarkdown";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Journal } from "@/lib/api";

interface JournalProps {
  journal: Journal;
}

export default function JournalDetails({ journal }: JournalProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto pt-4 pb-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={
                  journal.iconCid
                    ? `https://pub.desci.com/ipfs/${journal.iconCid}`
                    : "/placeholder.svg?height=300&width=400"
                }
                alt={journal.name}
                className="w-full h-auto rounded-lg object-center"
              />
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-3xl font-bold mb-2">{journal.name}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push(`${journal.id}/edit`)}
                >
                  <Pen className="w-4 h-4" />
                  <span className="ml-1">Edit</span>
                </Button>
              </div>
              <p className="text-xl text-muted-foreground mb-4">
                {journal.description}
              </p>
              <ExpandableMarkdown
                className="text-muted-foreground markdown w-full mx-auto"
                text={journal.description}
                containerClassName={"!left-0"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          {/* Journal Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Journal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Created</dt>
                  <dd className="text-muted-foreground">
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
