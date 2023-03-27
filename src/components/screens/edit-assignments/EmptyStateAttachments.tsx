import Image from "next/image";
import React from "react";
import teacherImage from "src/assets/teacher.svg";
type EmptyStateAttachmentsProps = {
  isSubmissions?: boolean;
};
function EmptyStateAttachments({ isSubmissions }: EmptyStateAttachmentsProps) {
  return (
    <>
      <h2 className="mb-5 text-3xl">
        {isSubmissions ? "Submissions" : "Attachments"}
      </h2>
      <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
        <Image
          width="150"
          height="150"
          src={teacherImage}
          alt="no classrooms found"
        />
        {isSubmissions ? (
          <p className="text-center text-xl">
            No submissions have been made for this assignment yet.
          </p>
        ) : (
          <p className="text-center text-xl">
            No attachments have been added for this assignment yet.
          </p>
        )}
      </div>
    </>
  );
}
export default EmptyStateAttachments;
