export function isTeacher(user: any) {

  if (user.role !== "teacher") {
    throw new Error(
      "Only teachers are allowed"
    );
  }

  return true;
}