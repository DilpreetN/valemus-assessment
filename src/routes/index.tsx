import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-6">
      <section className="py-2">
        <h1>Valemus Assessment</h1>
      </section>
      <section className="py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      <section>
        <Tabs defaultValue="assignments">
          <TabsList variant="line">
            <TabsTrigger value="assignments">Aufgaben</TabsTrigger>
            <TabsTrigger value="projects">Projekt</TabsTrigger>
          </TabsList>
          <Card>
            <CardContent>
              <TabsContent value="assignments">Assignments</TabsContent>
              <TabsContent value="projects">projects</TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </section>
    </main>
  );
}
