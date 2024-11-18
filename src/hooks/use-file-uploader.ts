import { useState } from "react";

export type FileUploaderResult = {
  handleFileUploadEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageContent: string;
  rawContent: string;
  imageMetadata: { height: number; width: number; name: string } | null;
  cancel: () => void;
  handleFileUpload: (file: File) => void;
};

const parseSvgFile = (content: string, fileName: string) => {
  const parser = new DOMParser();

  const svgDoc = parser.parseFromString(content, "image/svg+xml");

  const svgElement = svgDoc.documentElement;

  const width = parseInt(svgElement.getAttribute("width") ?? "300");
  const height = parseInt(svgElement.getAttribute("height") ?? "150");

  // conver svg content to blog url

  const svgBlob = new Blob([content], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);

  return {
    content: svgUrl,
    metadata: {
      width,
      height,
      name: fileName,
    },
  };
};

const parseImageFile = (
  content: string,
  filename: string
): Promise<{
  content: string;
  metadata: { width: number; height: number; name: string };
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        content,
        metadata: {
          width: img.width,
          height: img.height,
          name: filename,
        },
      });
    };

    img.src = content;
  });
};

export const useFileUploader = (): FileUploaderResult => {
  const [imageContent, setImageContent] = useState<string>("");
  const [rawContent, setRawContent] = useState<string>("");
  const [imageMetadata, setImageMetadata] = useState<{
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setRawContent(content);

      if (file.type === "image/svg+xml") {
        const { content: svgContent, metadata } = parseSvgFile(
          content,
          file.name
        );

        setImageContent(svgContent);
        setImageMetadata(metadata);
      } else {
        const { content: imgContent, metadata } = await parseImageFile(
          content,
          file.name
        );

        setImageContent(imgContent);
        setImageMetadata(metadata);
      }
    };

    if (file.type === "image/svg+xml") {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadEvent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  //   const handleFilePaste = useCallback((file: File) => {
  //     processFile(file);
  //   }, []);

  const cancel = () => {
    setImageContent("");
    setImageMetadata(null);
  };

  return {
    handleFileUploadEvent,
    imageContent,
    rawContent,
    imageMetadata,
    cancel,
    // handleFilePaste,
    handleFileUpload: processFile,
  };
};
