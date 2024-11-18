import FileDropzone from "@/components/file-dropzone";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";

export type Scale = "custom" | number;

function SvgToolCore(props: { fileUploaderProps: FileUploaderResult }) {
  const {} = props;

  return <></>;
}

export default function Home() {
  const fileUploaderProps = useFileUploader();
  return (
    <FileDropzone
      setCurrentFile={fileUploaderProps.handleFileUpload}
      acceptedFileTypes={["image/svg+xml", ".svg"]}
      dropText="Drop Svg"
    >
      <SvgToolCore fileUploaderProps={fileUploaderProps} />
    </FileDropzone>
  );
}
