import { Attachment, Submission } from "@prisma/client";
import { supabase } from "src/libs/supabaseClient";

type AssignmentKey = {
  assignmentId: string;
  attachmentId: string;
  filename: string;
};
type SubmissionKey = {
  submissionId: string;
  studentId: string;
  filename: string;
};
type Key = AssignmentKey | SubmissionKey;

function getKeyUrl(key: Key): string {
  if ("assignmentId" in key) {
    return `assignments/${key.assignmentId}/${key.attachmentId}/${key.filename}`;
  }
  return `submissions/${key.submissionId}/${key.studentId}/${key.filename}`;
}

const supabaseDeleteFile = async (key: Key) => {
  const { error } = await supabase.storage
    .from("files")
    .remove([getKeyUrl(key)]);
  if (error) {
    alert(error.message);
    return;
  }
};

const getDownloadUrl = async (key: Key) => {
  const { data } = await supabase.storage
    .from("files")
    .getPublicUrl(getKeyUrl(key), {
      download: true,
    });

  if (data) {
    window.open(data.publicUrl, "_blank", "noopener,noreferrer");
  }
};

const firstLetterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// function to check if the data is an array of submissions or attachments
function assertIsSubmissionArray(
  data: Attachment[] | Submission[]
): asserts data is Submission[] {
  if (data[0] && "studentId" in data[0]) {
    return;
  }
  throw new Error("Data is not an array of submissions");
}

function assertIsAttachmentArray(
  data: Attachment[] | Submission[]
): asserts data is Attachment[] {
  if (data[0] && "studentId" in data[0]) {
    throw new Error("Data is not an array of attachments");
  }
  return;
}

export {
  getKeyUrl,
  supabaseDeleteFile,
  getDownloadUrl,
  firstLetterToUpperCase,
  assertIsSubmissionArray,
  assertIsAttachmentArray,
};
