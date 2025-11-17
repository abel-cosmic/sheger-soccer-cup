"use client";
import { useState, useRef } from "react";
import { type Control, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type FormValues = {
  schoolName: string;
  numberOfPlayers: string;
  players: Array<{
    firstName: string;
    lastName: string;
    schoolIdUrl: string;
  }>;
};

interface PlayerFormProps {
  index: number;
  control: Control<FormValues>;
  onRemove?: () => void;
  canRemove: boolean;
}

const PlayerForm = ({
  index,
  control,
  onRemove,
  canRemove,
}: PlayerFormProps) => {
  const { setValue } = useFormContext<FormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file",
      });
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File too large", {
        description: "File size must be less than 4MB",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      setFileName(file.name);
      setValue(`players.${index}.schoolIdUrl`, base64String, {
        shouldValidate: true,
      });
      toast.success("School ID image selected", {
        description: `${file.name} is ready to upload`,
      });
    };
    reader.onerror = () => {
      toast.error("Error reading file", {
        description: "Failed to read the image file. Please try again.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file",
      });
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File too large", {
        description: "File size must be less than 4MB",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      setFileName(file.name);
      setValue(`players.${index}.schoolIdUrl`, base64String, {
        shouldValidate: true,
      });
      toast.success("School ID image selected", {
        description: `${file.name} is ready to upload`,
      });
    };
    reader.onerror = () => {
      toast.error("Error reading file", {
        description: "Failed to read the image file. Please try again.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileName(null);
    setValue(`players.${index}.schoolIdUrl`, "", {
      shouldValidate: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-2 border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          Player {index + 1}
        </h3>
        {canRemove && onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-6 w-6 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`players.${index}.firstName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                First Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter first name"
                  {...field}
                  className="h-12 border-2 focus-visible:ring-secondary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`players.${index}.lastName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Last Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter last name"
                  {...field}
                  className="h-12 border-2 focus-visible:ring-secondary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`players.${index}.schoolIdUrl`}
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              School ID <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {previewUrl ? (
                  <div className="relative">
                    <div className="border-2 border-border rounded-lg p-2 bg-background min-h-[200px] flex items-center justify-center">
                      <Image
                        src={previewUrl}
                        alt={`Player ${index + 1} School ID`}
                        width={200}
                        height={200}
                        className="w-full h-auto rounded max-h-48 object-contain"
                        unoptimized
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemove}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {fileName && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {fileName}
                        <span className="ml-2 text-green-600">✓ Ready</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-secondary transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 bg-muted rounded-full">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drop school ID image here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or JPEG (Max 4MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PlayerForm;
