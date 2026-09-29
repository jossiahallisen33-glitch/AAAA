/**
 * 课程仓库。cover 存网址，图片文件在 public/uploads/covers。
 */
import { mockCourses } from "@/data/mock-courses";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/types";

let nextId = 1;
for (const course of mockCourses) {
  if (course.id >= nextId) {
    nextId = course.id + 1;
  }
}

function copyCourse(course: Course): Course {
  return { ...course };
}

function toNumber(id: string | number): number {
  return Number(id);
}

export function findAll(keyword = ""): Course[] {
  const text = keyword.trim().toLowerCase();
  const result: Course[] = [];

  for (const course of mockCourses) {
    const inTitle = course.title.toLowerCase().includes(text);
    const inTeacher = course.teacher.toLowerCase().includes(text);
    if (!text || inTitle || inTeacher) {
      result.push(copyCourse(course));
    }
  }

  result.sort((left, right) => right.id - left.id);
  return result;
}

export function findById(id: string | number): Course | null {
  const numberId = toNumber(id);
  for (const course of mockCourses) {
    if (course.id === numberId) {
      return copyCourse(course);
    }
  }
  return null;
}

export function create(data: CreateCourseInput): Course {
  const item: Course = {
    id: nextId,
    title: data.title.trim(),
    summary: data.summary.trim(),
    teacher: data.teacher.trim(),
    hours: Number(data.hours),
    status: data.status,
    cover: data.cover,
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  mockCourses.push(item);
  return copyCourse(item);
}

export function update(
  id: string | number,
  data: UpdateCourseInput,
): Course | null {
  const numberId = toNumber(id);
  const index = mockCourses.findIndex((course) => course.id === numberId);
  if (index === -1) {
    return null;
  }

  const oldItem = mockCourses[index];
  mockCourses[index] = {
    id: oldItem.id,
    createdAt: oldItem.createdAt,
    title: data.title.trim(),
    summary: data.summary.trim(),
    teacher: data.teacher.trim(),
    hours: Number(data.hours),
    status: data.status,
    cover: data.cover ? data.cover : oldItem.cover,
  };
  return copyCourse(mockCourses[index]);
}

export function remove(id: string | number): boolean {
  const numberId = toNumber(id);
  const index = mockCourses.findIndex((course) => course.id === numberId);
  if (index === -1) {
    return false;
  }
  mockCourses.splice(index, 1);
  return true;
}

export function countCourses(): number {
  return mockCourses.length;
}
