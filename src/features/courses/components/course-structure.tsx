/* eslint-disable @typescript-eslint/no-explicit-any */

import { ButtonDialog } from "@/features/user-dashboard/components/sidebar/button-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewChapterForm } from "@/features/chapters/components/new-chapter-form";
import { useTRPC } from "@/trpc/client";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileIcon,
  GripHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseGetOneAdminOutput } from "../types";
import { NewLessonForm } from "@/features/lessons/components/new-lesson-form";
import { ButtonAlertDialog } from "@/features/user-dashboard/components/sidebar/button-alert-dialog";
import Link from "next/link";

interface Props {
  data: CourseGetOneAdminOutput;
  courseId: string;
}

export function CourseStructure({ data, courseId }: Props) {
  const [items, setItems] = useState(
    data.chapters.map((chapter) => ({
      ...chapter,
    }))
  );

  useEffect(() => {
    setItems(
      data.chapters.map((c) => ({
        ...c,
      }))
    );
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: reorderedChapter, isPending: reorderedChapterPending } =
    useMutation(
      trpc.chapters.reordered.mutationOptions({
        onMutate: () => {
          toast("REORDERING CHAPTERS, PLEASE WAIT A MOMENT");
        },
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
          toast.success("Sucessfully reordered chapters");
        },
        onError: () => {
          toast.error("Failed to reordered chapters");
        },
      })
    );

  const { mutate: reorderedLesson, isPending: reorderedLessonPending } =
    useMutation(
      trpc.lessons.reordered.mutationOptions({
        onMutate: () => {
          toast("REORDERING LESSONS, PLEASE WAIT A MOMENT");
        },
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
          toast.success("Sucessfully reordered lessons");
        },
        onError: () => {
          toast.error("Failed to reordered lessons");
        },
      })
    );

  const { mutate: deleteChapter, isPending: deleteChapterPending } =
    useMutation(
      trpc.chapters.delete.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
          toast.success("Sucessfully delete chapter");
        },
        onError: () => {
          toast.error("Failed to delete chapter");
        },
      })
    );

  const { mutate: deleteLesson, isPending: deleteLessonPending } = useMutation(
    trpc.lessons.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.courses.getOneAdmin.queryFilter());
        toast.success("Sucessfully delete lessons");
      },
      onError: () => {
        toast.error("Failed to delete lessons");
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeLessonId = active.data.current?.lessons?.id;
    const activeLessonChapterId = active.data.current?.lessons?.chapterId;
    const overLessonId = over?.data.current?.lessons?.id as string;

    if (active.id !== over?.id && !activeLessonId) {
      const getActiveIndex = data.chapters.findIndex(
        (c) => c.id === active?.id
      );
      const getOverIndex = data.chapters.findIndex((c) => c.id === over?.id);

      const reorderedChapterArray = arrayMove(
        items,
        getActiveIndex,
        getOverIndex
      );

      setItems(reorderedChapterArray);

      reorderedChapter({
        courseId,
        chapterIds: reorderedChapterArray.map((i) => i.id),
      });
    } else {
      if (active.id !== over?.id && activeLessonId && overLessonId) {
        const getChapterLessonIndex = items.findIndex(
          (i) => i.id === activeLessonChapterId
        );

        if (getChapterLessonIndex !== -1) {
          const getActiveLessonId = items[
            getChapterLessonIndex
          ].lessons.findIndex((l) => l.id === activeLessonId);

          const overActiveLessonId = items[
            getChapterLessonIndex
          ].lessons.findIndex((l) => l.id === overLessonId);

          const reorderedLessons = arrayMove(
            items[getChapterLessonIndex].lessons,
            getActiveLessonId,
            overActiveLessonId
          );

          setItems(
            items.map((i) =>
              i.id === activeLessonChapterId
                ? {
                    ...i,
                    lessons: reorderedLessons,
                  }
                : i
            )
          );

          reorderedLesson({
            chapterId: activeLessonChapterId,
            lessonIds: reorderedLessons.map((i) => i.id),
          });
        }
      }
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card className="mt-1">
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
          <CardDescription>
            Here you can update your Course Structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Chapters</CardTitle>
              <ButtonDialog
                buttonText="New Chapter"
                icon={PlusIcon}
                buttonVariant="secondary"
                title="New Chapter"
                description="What would you like to name the chapter"
              >
                <NewChapterForm courseId={courseId} />
              </ButtonDialog>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-y-2">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      data={{ title: item.title }}
                    >
                      {(listeners) => (
                        <Card>
                          <CardHeader className="flex items-center justify-between border-b">
                            <CardTitle>
                              <div className="flex items-center gap-x-2">
                                <GripHorizontalIcon
                                  className="size-4 cursor-grab"
                                  {...listeners}
                                />
                                <span>{item.title}</span>
                              </div>
                            </CardTitle>
                            <CardDescription>
                              <ButtonAlertDialog
                                buttonText="Delete"
                                title="Are you sure?"
                                description="This action cannot be undone. Please be carefully"
                                func={() =>
                                  deleteChapter({
                                    id: item.id,
                                  })
                                }
                              >
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  disabled={
                                    deleteChapterPending || deleteLessonPending
                                  }
                                >
                                  <Trash2Icon />
                                </Button>
                              </ButtonAlertDialog>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <SortableContext
                              strategy={verticalListSortingStrategy}
                              items={item.lessons.map((lesson) => lesson.id)}
                            >
                              <div className="flex flex-col gap-y-5">
                                {item.lessons.map((lesson) => (
                                  <SortableItem
                                    key={lesson.id}
                                    id={lesson.id}
                                    data={{
                                      title: lesson.title,
                                      lessons: {
                                        chapterId: item.id,
                                        id: lesson.id,
                                      },
                                    }}
                                  >
                                    {(listeners) => (
                                      <div className="flex items-center justify-between hover:bg-primary/10 cursor-pointer p-2 rounded transition-colors">
                                        <div className="flex items-center gap-x-2">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            {...listeners}
                                            className="cursor-grab"
                                            size="sm"
                                          >
                                            <GripHorizontalIcon className="size-4" />
                                          </Button>
                                          <FileIcon className="size-4" />
                                          <Link
                                            href={`/admin/courses/${courseId}/lesson/${lesson.id}`}
                                          >
                                            {lesson.title}
                                          </Link>
                                        </div>
                                        <ButtonAlertDialog
                                          buttonText="Delete"
                                          title="Are you sure?"
                                          description="This action cannot be undone. Please be carefully"
                                          func={() =>
                                            deleteLesson({
                                              id: lesson.id,
                                            })
                                          }
                                        >
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={
                                              deleteChapterPending ||
                                              deleteLessonPending
                                            }
                                          >
                                            <Trash2Icon />
                                          </Button>
                                        </ButtonAlertDialog>
                                      </div>
                                    )}
                                  </SortableItem>
                                ))}
                                <div>
                                  <ButtonDialog
                                    buttonText="New Lesson"
                                    icon={PlusIcon}
                                    title="New Lesson"
                                    className="w-full"
                                    description="What would you like to name the lesson"
                                  >
                                    <NewLessonForm chapterId={item.id} />
                                  </ButtonDialog>
                                </div>
                              </div>
                            </SortableContext>
                          </CardContent>
                        </Card>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </DndContext>
  );
}

interface SortableProps {
  id: string;
  data: {
    title: string;
    lessons?: {
      id: string;
      chapterId: string;
    };
  };
  children: (listeners: any) => React.ReactNode;
}

export function SortableItem({ id, data, children }: SortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  );
}

/* 

    
*/
