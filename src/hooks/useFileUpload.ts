import { useRef, useState } from "react";
import { supabase } from "src/libs/supabaseClient";

const useFileUpload = ({
  onFileUploaded,
  getUploadUrl,
}: {
  onFileUploaded: () => void;
  getUploadUrl: (file: File) => Promise<string>;
}) => {
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.currentTarget.files?.[0]);
  };

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const url = await getUploadUrl(file);
    console.log("RcFile", file);

    const { error } = await supabase.storage.from("files").upload(url, file);
    if (error) {
      return;
    }
    setFile(undefined);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    onFileUploaded();
  };

  return { fileRef, file, handleFileChange, uploadFile };
};

export default useFileUpload;
