import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorMessageProps {
  title?: string;
  message: string | string[];
  className?: string;
}

export function ErrorMessage({
  title = "Error",
  message,
  className,
}: ErrorMessageProps) {
  const messages = Array.isArray(message) ? message : [message];

  return (
    <Alert variant="destructive" className={cn("mb-4", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {messages.length === 1 ? (
        <AlertDescription>{messages[0]}</AlertDescription>
      ) : (
        <ul className="list-disc pl-4">
          {messages.map((msg, idx) => (
            <li key={idx}>
              <AlertDescription>{msg}</AlertDescription>
            </li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
