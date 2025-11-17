import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
interface Player {
  firstName: string;
  lastName: string;
  schoolIdUrl: string;
}

interface RegistrationData {
  schoolName: string;
  players: Player[];
}

interface Team {
  id: string;
  schoolName: string;
  createdAt: string;
  players: Array<{
    id: string;
    firstName: string;
    lastName: string;
    schoolIdUrl: string;
    createdAt: string;
  }>;
}

// API Functions
async function registerTeam(data: RegistrationData) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

async function fetchTeams(): Promise<{ teams: Team[] }> {
  const response = await fetch("/api/teams");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch teams");
  }

  return response.json();
}

// Hooks
export function useRegisterTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerTeam,
    onSuccess: () => {
      // Invalidate and refetch teams list
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    select: (data) => data.teams,
  });
}

