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

export { getKeyUrl };
