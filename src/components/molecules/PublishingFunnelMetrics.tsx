import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, UserPlus } from "lucide-react";
import { DateFilterWithPresets } from "./DateFilterbar";

interface PublishingFunnelData {
  publishedResearchObjects: {
    percentage: number;
    total: number;
  };
  communityPublications: {
    percentage: number;
    total: number;
  };
  guestSignups: {
    percentage: number;
    total: number;
  };
}

async function getPublishingFunnelData(): Promise<PublishingFunnelData> {
  // TODO: Implement actual data fetching
  // This is a placeholder that returns mock data
  return {
    publishedResearchObjects: {
      percentage: 65,
      total: 130,
    },
    communityPublications: {
      percentage: 45,
      total: 90,
    },
    guestSignups: {
      percentage: 30,
      total: 60,
    },
  };
}

const KpiCard = ({
  title,
  description,
  value,
  icon: Icon,
}: {
  title: string;
  description: string;
  value: number;
  icon: React.ElementType;
}) => {
  return (
    <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}%</div>
      </CardContent>
    </Card>
  );
};

export default async function PublishingFunnelMetrics() {
  const metricsData = await getPublishingFunnelData();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">
          Monitor user conversion from creation to publication and
          community-level participation.
        </p>
        <div className="flex items-center justify-end gap-3">
          <DateFilterWithPresets />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Published Research Objects"
          description="% of users who published a research object"
          value={metricsData.publishedResearchObjects.percentage}
          icon={FileText}
        />
        <KpiCard
          title="Community Publications"
          description="% of users who published in a community"
          value={metricsData.communityPublications.percentage}
          icon={Users}
        />
        <KpiCard
          title="Guest Signups"
          description="% of unique guest users who sign up"
          value={metricsData.guestSignups.percentage}
          icon={UserPlus}
        />
      </div>
    </div>
  );
}
