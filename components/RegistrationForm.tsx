"use client";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Info } from "lucide-react";
import PlayerForm from "./PlayerForm";
import { useRegisterTeam } from "@/lib/api-hooks";

const playerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  schoolIdUrl: z
    .string()
    .min(1, "School ID image is required")
    .refine((val) => val.startsWith("data:image/"), {
      message: "School ID must be a valid image",
    }),
});

const formSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name is too long"),
  numberOfPlayers: z.string().min(1, "Please select number of players"),
  players: z.array(playerSchema).min(1).max(6),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const registerMutation = useRegisterTeam();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      numberOfPlayers: "",
      players: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "players",
  });

  // Watch the number of players field
  const numberOfPlayers = form.watch("numberOfPlayers");
  const playerCount = numberOfPlayers ? parseInt(numberOfPlayers) : 0;

  // Generate player count options (1-6)
  const playerOptions = Array.from({ length: 6 }, (_, i) => i + 1);

  // Update players array when numberOfPlayers changes
  useEffect(() => {
    if (playerCount > 0) {
      const currentCount = fields.length;
      if (currentCount < playerCount) {
        // Add missing players
        const toAdd = playerCount - currentCount;
        for (let i = 0; i < toAdd; i++) {
          append({
            firstName: "",
            lastName: "",
            schoolIdUrl: "",
          });
        }
      } else if (currentCount > playerCount) {
        // Remove excess players
        const toRemove = currentCount - playerCount;
        for (let i = 0; i < toRemove; i++) {
          remove(currentCount - 1 - i);
        }
      }
    } else {
      // Clear players if no number selected
      replace([]);
    }
  }, [playerCount, fields.length, append, remove, replace]);

  const onSubmit = async (data: FormValues) => {
    // Validate all players have required fields and uploaded images
    const incompletePlayers: number[] = [];
    data.players.forEach((player, index) => {
      if (
        !player.firstName.trim() ||
        !player.lastName.trim() ||
        !player.schoolIdUrl ||
        !player.schoolIdUrl.startsWith("data:image/")
      ) {
        incompletePlayers.push(index);
      }
    });

    if (incompletePlayers.length > 0) {
      toast.error("Incomplete Information", {
        description: `Please fill in all fields and upload school ID images for all players. Missing: Player ${incompletePlayers
          .map((i) => i + 1)
          .join(", ")}`,
      });
      return;
    }

    toast.loading("Registering team...", { id: "registering" });

    registerMutation.mutate(
      {
        schoolName: data.schoolName,
        players: data.players,
      },
      {
        onSuccess: () => {
          toast.dismiss("registering");
          toast.success("Registration Successful!", {
            description: `${data.schoolName} has been registered with ${data.players.length} players.`,
          });
          form.reset();
          replace([]);
        },
        onError: (error) => {
          toast.dismiss("registering");
          console.error("Registration error:", error);
          toast.error("Registration Failed", {
            description:
              error instanceof Error
                ? error.message
                : "An error occurred during registration. Please try again.",
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="schoolName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-semibold">
                School Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter school name"
                  {...field}
                  className="h-12 border-2 focus-visible:ring-secondary w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfPlayers"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-semibold">
                Number of Players (1-6){" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="h-12 border-2 focus:ring-secondary w-full">
                    <SelectValue placeholder="Select number of players" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {playerOptions.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Player Forms - Only shown after selecting number of players */}
        {!numberOfPlayers ? (
          <Alert className="border-2 border-muted bg-muted/50">
            <Info className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-sm text-muted-foreground">
              Please select the number of players first to continue with player
              registration
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Player Information
              </h3>
              <span className="text-sm text-muted-foreground">
                {fields.length} player{fields.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <PlayerForm
                  key={field.id}
                  index={index}
                  control={form.control}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 10}
                />
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={
            !numberOfPlayers ||
            registerMutation.isPending ||
            fields.length === 0
          }
          className="w-full h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending
            ? "Registering..."
            : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
