import type { UploadFile, UploadProps } from "antd";
import { message } from "antd";
import { useState } from "react";
import { supabase } from "src/libs/supabaseClient";

const useAntUpload = ({
  onFileUploaded,
  getUploadUrl,
}: {
  onFileUploaded: () => void;
  getUploadUrl: (file: File) => Promise<string>;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);

    async function uploadFile(file: File) {
      const url = await getUploadUrl(file);

      return await supabase.storage.from("files").upload(url, file);
    }

    // loop over the files and upload them. We use promises to make sure that every file is uploaded at the same time
    Promise.all(
      fileList.map((file) => {
        return uploadFile(file.originFileObj as File);
      })
    )
      .then((data) => {
        if (data.some((d) => d.error)) {
          message.error("Error uploading files");
          console.error(data);
          return;
        } else {
          message.success("Files uploaded successfully!");
          setFileList([]);
          onFileUploaded();
        }
      })
      .catch((error: any) => {
        message.error("Error uploading files");
        console.error(error);
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
  };

  return { fileList, uploadProps, uploading, handleUpload };
};

export default useAntUpload;
