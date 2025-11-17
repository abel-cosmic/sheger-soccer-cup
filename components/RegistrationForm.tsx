"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DndContext } from "@dnd-kit/core";
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
import ImageUpload from "./ImageUpload";

const formSchema = z.object({
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
  numberOfPlayers: z.string().min(1, "Please select number of players"),
  schoolId: z
    .any()
    .refine(
      (files) => Array.isArray(files) && files.length > 0,
      "School ID images are required",
    ),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      numberOfPlayers: "",
      schoolId: [],
    },
  });

  // Watch the number of players field
  const numberOfPlayers = form.watch("numberOfPlayers");
  const maxFiles = numberOfPlayers ? parseInt(numberOfPlayers) : 0;

  const onSubmit = (data: FormValues) => {
    const images = data.schoolId as File[];
    if (images.length !== maxFiles) {
      toast.error("Incomplete Upload", {
        description: `Please upload exactly ${maxFiles} school ID images (one per player).`,
      });
      return;
    }

    console.log("Form submitted:", data);
    toast.success("Registration Successful!", {
      description: `Welcome ${data.firstName} ${data.lastName}! Your team of ${data.numberOfPlayers} players with ${images.length} IDs has been registered.`,
    });
    form.reset();
    setSelectedImages([]);
  };

  const handleImageSelect = (files: File[]) => {
    setSelectedImages(files);
    form.setValue("schoolId", files, { shouldValidate: true });
  };

  // Generate player count options (10-16)
  const playerOptions = Array.from({ length: 7 }, (_, i) => i + 10);

  return (
    <DndContext>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-semibold">
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
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
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-semibold">
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      className="h-12 border-2 focus-visible:ring-secondary w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="numberOfPlayers"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-semibold">
                  Number of Players (10-16){" "}
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

          {/* School ID Upload - Only shown after selecting number of players */}
          {!numberOfPlayers ? (
            <Alert className="border-2 border-muted bg-muted/50">
              <Info className="h-4 w-4 text-muted-foreground" />
              <AlertDescription className="text-sm text-muted-foreground">
                Please select the number of players first to continue with
                school ID upload
              </AlertDescription>
            </Alert>
          ) : (
            <FormField
              control={form.control}
              name="schoolId"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImages={selectedImages}
                      maxFiles={maxFiles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={!numberOfPlayers}
            className="w-full h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Registration
          </Button>
        </form>
      </Form>
    </DndContext>
  );
};

export default RegistrationForm;
