import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">Status: placeholder</p>
      </CardContent>
    </Card>
  );
}
