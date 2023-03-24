enum Roles {
  Teacher = "teacher",
  Student = "student",
}

export const SubmissionStatus = {
  pending: "pending",
  viewed: "viewed",
  graded: "graded",
  late: "late",
};

export const SubmissionStatusColor = {
  pending: "orange",
  viewed: "blue",
  graded: "green",
  late: "red",
};

export const getSubmissionStatusColor = (status: string) => {
  switch (status) {
    case SubmissionStatus.pending:
      return SubmissionStatusColor.pending;
    case SubmissionStatus.viewed:
      return SubmissionStatusColor.viewed;
    case SubmissionStatus.graded:
      return SubmissionStatusColor.graded;
    case SubmissionStatus.late:
      return SubmissionStatusColor.late;
    default:
      return SubmissionStatusColor.pending;
  }
};

export const SubmissionStatusFilterOptions = [
  {
    text: "Pending",
    value: "pending",
  },
  {
    text: "Viewed",
    value: "viewed",
  },
  {
    text: "Graded",
    value: "graded",
  },
  {
    text: "Late",
    value: "late",
  },
];

export const AssignmentStatus = {
  progressing: "progressing",
  completed: "completed",
  suspended: "suspended",
};

export const AssignmentStatusColor = {
  progressing: "blue",
  completed: "green",
  suspended: "orange",
};

export const getAssignmentStatusColor = (status: string) => {
  switch (status) {
    case AssignmentStatus.progressing:
      return AssignmentStatusColor.progressing;
    case AssignmentStatus.completed:
      return AssignmentStatusColor.completed;
    case AssignmentStatus.suspended:
      return AssignmentStatusColor.suspended;
    default:
      return AssignmentStatusColor.progressing;
  }
};

export const AssignmentStatusFilterOptions = [
  {
    text: "Progressing",
    value: "progressing",
  },
  {
    text: "Completed",
    value: "completed",
  },
  {
    text: "Suspended",
    value: "suspended",
  },
];

export const ClassroomStatus = {
  active: "active",
  inactive: "inactive",
  archived: "archived",
};

export const ClassroomStatusColor = {
  active: "green",
  inactive: "orange",
  archived: "red",
};

export const getClassroomStatusColor = (status: string) => {
  switch (status) {
    case ClassroomStatus.active:
      return ClassroomStatusColor.active;
    case ClassroomStatus.inactive:
      return ClassroomStatusColor.inactive;
    case ClassroomStatus.archived:
      return ClassroomStatusColor.archived;
    default:
      return ClassroomStatusColor.active;
  }
};

export const ClassroomStatusFilterOptions = [
  {
    text: "Active",
    value: "active",
  },
  {
    text: "Inactive",
    value: "inactive",
  },
  {
    text: "Archived",
    value: "archived",
  },
];

export default Roles;
