"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Eye } from "lucide-react";
import { useTeams } from "@/lib/api-hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  schoolIdUrl: string;
  createdAt: string;
}

interface Team {
  id: string;
  schoolName: string;
  createdAt: string;
  players: Player[];
}

export default function RegistrationsPage() {
  const { data: teams = [], isLoading: loading, error, refetch } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewPlayers = (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="p-6 border-2 border-destructive">
          <p className="text-destructive mb-4">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-linear-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-primary shadow-tournament">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={"/images/logo.png"}
                alt="Sheger School Cup"
                width={100}
                height={100}
                className="h-16 md:h-20 object-contain"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  SHEGER SCHOOL CUP
                </h1>
                <p className="text-sm md:text-base text-primary-foreground/80 font-medium">
                  Registered Teams
                </p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Registration
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            All Registered Teams ({teams.length})
          </h2>
          <Button onClick={() => refetch()} variant="outline">
            Refresh
          </Button>
        </div>

        {teams.length === 0 ? (
          <Card className="p-12 text-center border-2 border-border">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Teams Registered Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to register your team!
            </p>
            <Link href="/">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Register Your Team
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="border-2 border-border shadow-tournament">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">#</TableHead>
                  <TableHead className="font-bold">School Name</TableHead>
                  <TableHead className="font-bold">Number of Players</TableHead>
                  <TableHead className="font-bold">Registration Date</TableHead>
                  <TableHead className="font-bold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {team.schoolName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {team.players.length} Player
                          {team.players.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(team.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPlayers(team)}
                        className="hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Players
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Players Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedTeam?.schoolName}
              </DialogTitle>
              <DialogDescription>
                Team Players and School ID Information
              </DialogDescription>
            </DialogHeader>

            {selectedTeam && (
              <div className="mt-4">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">
                    {selectedTeam.players.length} Player
                    {selectedTeam.players.length !== 1 ? "s" : ""}
                  </span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>Registered {formatDate(selectedTeam.createdAt)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTeam.players.map((player, index) => (
                    <Card
                      key={player.id}
                      className="border-2 border-border p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-lg text-foreground">
                            {player.firstName} {player.lastName}
                          </h4>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-semibold">
                            Player {index + 1}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Registered: {formatDate(player.createdAt)}
                        </p>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2 text-muted-foreground">
                          School ID:
                        </p>
                        <div className="border-2 border-border rounded-lg p-2 bg-muted/20">
                          <Image
                            src={player.schoolIdUrl}
                            alt={`${player.firstName} ${player.lastName} School ID`}
                            width={300}
                            height={300}
                            className="w-full h-auto rounded max-h-48 object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="bg-primary mt-16 py-6 border-t-4 border-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 Sheger School Cup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
