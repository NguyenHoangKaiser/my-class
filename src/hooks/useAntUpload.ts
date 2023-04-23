import type { UploadFile, UploadProps } from "antd";
import { message } from "antd";
import { useState } from "react";
import { supabase } from "src/libs/supabaseClient";

const useAntUpload = ({
  onFileUploaded,
  getUploadUrl,
  canUpdate = false,
  successMessage = "Files uploaded successfully!",
  errorMessage = "Error uploading files",
}: {
  onFileUploaded?: () => void;
  getUploadUrl: (file: File) => Promise<string>;
  canUpdate?: boolean;
  successMessage?: string;
  errorMessage?: string;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);

    async function uploadFile(file: File) {
      const url = await getUploadUrl(file);

      if (canUpdate) {
        const data = await supabase.storage.from("files").update(url, file, {
          upsert: true,
        });
        if (data.error && data.error.message === "The resource was not found") {
          return await supabase.storage.from("files").upload(url, file);
        }
        return data;
      } else {
        return await supabase.storage.from("files").upload(url, file);
      }
    }

    // loop over the files and upload them. We use promises to make sure that every file is uploaded at the same time
    Promise.all(
      fileList.map((file) => {
        return uploadFile(file.originFileObj as File);
      })
    )
      .then((data) => {
        if (data.some((d) => d.error)) {
          message.error(errorMessage);
          return;
        } else {
          message.success(successMessage);
          setFileList([]);
          onFileUploaded && onFileUploaded();
        }
      })
      .catch((error: any) => {
        message.error(errorMessage || error.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: () => {
      return false;
    },
    fileList,
    onChange: (info) => {
      setFileList(info.fileList);
    },
    multiple: true,
    listType: "picture",
    previewFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
      });
    },
  };

  return { fileList, uploadProps, uploading, handleUpload };
};

export default useAntUpload;
