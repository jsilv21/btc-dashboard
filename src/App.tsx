import { useEffect, useState } from "react";
import { processBlocks } from "@/api/get-blocks";
import { BlocksList } from "@/components/BlocksList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simple sidebar component
function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-56 min-h-screen p-6 flex flex-col gap-4">
      <div className="text-2xl font-bold mb-8">BTC Dashboard</div>
      <nav className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start">
          Blocks
        </Button>
        <Button variant="ghost" className="justify-start">
          Details
        </Button>
        {/* Add more nav items here */}
      </nav>
    </aside>
  );
}

// Simple header component
function Header() {
  return (
    <header className="bg-white shadow px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Bitcoin Dashboard</h1>
      {/* Add user info, notifications, etc. here */}
    </header>
  );
}

export default function App() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displaySats, setDisplaySats] = useState(true); // new state variable

  useEffect(() => {
    processBlocks()
      .then(setBlocks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          {/* Example: stats cards at the top */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Last Block</CardTitle>
                <CardDescription>Most recently confirmed block</CardDescription>
              </CardHeader>
              <CardContent>
                <BlocksList
                  blocks={blocks.slice(0, 1)}
                  loading={loading}
                  error={error}
                  preview={true}
                  displaySats={displaySats} // pass the state variable
                />
              </CardContent>
            </Card>
            {/* Add more stat cards here */}
          </div>
          {/* Tabs for main content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blocks">Last 15 Blocks</TabsTrigger>
            </TabsList>
            <TabsContent value="blocks">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  {/* Add flex container */}
                  <CardTitle>Blocks Data</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDisplaySats(!displaySats)}
                  >
                    {displaySats ? "View in USD" : "View in Sats"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription>
                    Data for the last 15 blocks mined on the Bitcoin network.
                    <br />
                    Courtesy of{" "}
                    <a
                      href="https://mempool.space"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      mempool.space
                    </a>
                  </CardDescription>
                  <BlocksList
                    blocks={blocks}
                    loading={loading}
                    error={error}
                    preview={false}
                    displaySats={displaySats} // pass the state variable
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>overview</CardTitle>
                  <CardDescription>tbd</CardDescription>
                </CardHeader>
                {/* <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter> */}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
