"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  selectedImages: File[];
  maxFiles: number;
}

const ImageUpload = ({
  onImageSelect,
  selectedImages,
  maxFiles,
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  const { setNodeRef, isOver } = useDroppable({
    id: "school-id-upload",
  });

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles).filter((file) =>
      file.type.startsWith("image/"),
    );
    const remainingSlots = maxFiles - selectedImages.length;
    const filesToAdd = filesArray.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    const updatedFiles = [...selectedImages, ...filesToAdd];
    onImageSelect(updatedFiles);

    // Generate previews for new files
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [
          ...prev,
          { file, preview: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (fileToRemove: File) => {
    const updatedFiles = selectedImages.filter((f) => f !== fileToRemove);
    onImageSelect(updatedFiles);
    setPreviews((prev) => prev.filter((p) => p.file !== fileToRemove));
  };

  const canAddMore = selectedImages.length < maxFiles;

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-foreground mb-2">
        School ID Images ({selectedImages.length}/{maxFiles}){" "}
        <span className="text-destructive">*</span>
      </label>
      <p className="text-xs text-muted-foreground mb-3">
        Upload one ID image per player. You need {maxFiles} total images.
      </p>

      {/* Upload Area */}
      {canAddMore && (
        <Card
          ref={setNodeRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed transition-all mb-4 ${
            isOver ? "border-secondary bg-secondary/10" : "border-border"
          }`}
        >
          <label className="cursor-pointer block p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop school ID images here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  {maxFiles - selectedImages.length} more image
                  {maxFiles - selectedImages.length !== 1 ? "s" : ""} needed •
                  PNG, JPG or JPEG
                </p>
              </div>
            </div>
          </label>
        </Card>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((item, index) => (
            <Card key={index} className="relative p-2 border-2">
              <div className="relative aspect-square">
                <img
                  src={item.preview}
                  alt={`School ID ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(item.file)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate text-center">
                Player {index + 1}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
