"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import { documentDifficultyCatalog, getTopicsByGrade } from "@/data/catalog";
import { supabase } from "@/lib/supabase";
import type { DocumentDifficulty, GradeLevel } from "@/types/document";

const optionLabels = ["A", "B", "C", "D"];
const maxImageSize = 5 * 1024 * 1024;

type TestRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  grade: GradeLevel;
  topic: string;
  difficulty: DocumentDifficulty | null;
  duration_minutes: number | null;
  published: boolean;
  created_at: string;
};

type QuestionRow = {
  id: string;
  grade: GradeLevel;
  topic: string;
  difficulty: DocumentDifficulty | null;
  question_text: string;
  question_image_url: string | null;
  solution_text: string | null;
  published: boolean;
  created_at: string;
};

type OptionRow = {
  id: string;
  question_id: string;
  label: string;
  text: string;
  image_url: string | null;
  is_correct: boolean;
};

type TestItemRow = {
  question_set_id: string;
  question_id: string;
  position: number;
};

type NoticeTone = "success" | "warning" | "error" | "";
type CropMode = "none" | "wide" | "standard" | "square" | "free";

type TestForm = {
  title: string;
  description: string;
  grade: GradeLevel;
  topic: string;
  difficulty: "" | DocumentDifficulty;
  durationMinutes: string;
  published: boolean;
};

type FreeCropRect = { x: number; y: number; w: number; h: number };

type QuestionForm = {
  text: string;
  imageUrl: string;
  solution: string;
  options: string[];
  correct: string;
  cropMode: CropMode;
  cropX: number;
  cropY: number;
  cropZoom: number;
  freeCropRect: FreeCropRect;
};

const initialTestForm: TestForm = {
  title: "",
  description: "",
  grade: "8",
  topic: "",
  difficulty: "Orta",
  durationMinutes: "20",
  published: false,
};

const initialQuestionForm: QuestionForm = {
  text: "",
  imageUrl: "",
  solution: "",
  options: ["", "", "", ""],
  correct: "A",
  cropMode: "none",
  cropX: 50,
  cropY: 50,
  cropZoom: 100,
  freeCropRect: { x: 10, y: 10, w: 80, h: 80 },
};

const cropSizes = {
  wide: { width: 1200, height: 675, label: "16:9 geniş kırp" },
  standard: { width: 1200, height: 900, label: "4:3 standart kırp" },
  square: { width: 1000, height: 1000, label: "1:1 kare kırp" },
} satisfies Record<Exclude<CropMode, "none" | "free">, { width: number; height: number; label: string }>;

function slugifyTr(text: string) {
  return text
    .toLocaleLowerCase("tr")
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isValidHttpUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminTestBuilder() {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [options, setOptions] = useState<OptionRow[]>([]);
  const [items, setItems] = useState<TestItemRow[]>([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState("");
  const [testForm, setTestForm] = useState<TestForm>(initialTestForm);
  const [questionForm, setQuestionForm] = useState<QuestionForm>(initialQuestionForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const localPreviewUrlRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [savingTest, setSavingTest] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string }>({
    tone: "",
    message: "",
  });
  const [testSearch, setTestSearch] = useState("");
  const [testGradeFilter, setTestGradeFilter] = useState("");
  const [testStatusFilter, setTestStatusFilter] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");

  const selectedTest = tests.find((test) => test.id === selectedTestId) ?? null;
  const testTopics = useMemo(() => getTopicsByGrade(testForm.grade), [testForm.grade]);
  const imagePreviewUrl = localPreviewUrl || questionForm.imageUrl.trim();

  const optionsByQuestion = useMemo(() => {
    const map = new Map<string, OptionRow[]>();
    options.forEach((option) => {
      const current = map.get(option.question_id) ?? [];
      current.push(option);
      map.set(option.question_id, current);
    });
    map.forEach((questionOptions) =>
      questionOptions.sort((a, b) => a.label.localeCompare(b.label, "tr"))
    );
    return map;
  }, [options]);

  const selectedItems = useMemo(
    () =>
      items
        .filter((item) => item.question_set_id === selectedTestId)
        .sort((a, b) => a.position - b.position),
    [items, selectedTestId]
  );

  const selectedQuestions = useMemo(() => {
    const questionMap = new Map(questions.map((question) => [question.id, question]));
    return selectedItems
      .map((item) => questionMap.get(item.question_id))
      .filter((question): question is QuestionRow => Boolean(question));
  }, [questions, selectedItems]);

  const attachedQuestionIds = useMemo(
    () => new Set(selectedQuestions.map((question) => question.id)),
    [selectedQuestions]
  );

  const filteredTests = useMemo(
    () =>
      tests.filter((test) => {
        const search = testSearch.trim().toLocaleLowerCase("tr");
        const searchMatch = search
          ? `${test.title} ${test.description ?? ""} ${test.topic}`
              .toLocaleLowerCase("tr")
              .includes(search)
          : true;
        const gradeMatch = testGradeFilter ? test.grade === testGradeFilter : true;
        const statusMatch =
          testStatusFilter === "published"
            ? test.published
            : testStatusFilter === "draft"
              ? !test.published
              : true;
        return searchMatch && gradeMatch && statusMatch;
      }),
    [testGradeFilter, testSearch, testStatusFilter, tests]
  );

  const questionPool = useMemo(() => {
    const search = questionSearch.trim().toLocaleLowerCase("tr");
    return questions
      .filter((question) => {
        if (!selectedTest || attachedQuestionIds.has(question.id)) return false;
        const searchMatch = search
          ? `${question.question_text} ${question.topic} ${question.difficulty ?? ""}`
              .toLocaleLowerCase("tr")
              .includes(search)
          : true;
        return (
          question.grade === selectedTest.grade &&
          question.topic === selectedTest.topic &&
          searchMatch
        );
      })
      .slice(0, 30);
  }, [attachedQuestionIds, questionSearch, questions, selectedTest]);

  useEffect(() => {
    void loadBuilderData();
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
    // loadBuilderData reads transient selection state; initial load should run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedTest) return;
    setTestForm({
      title: selectedTest.title,
      description: selectedTest.description ?? "",
      grade: selectedTest.grade,
      topic: selectedTest.topic,
      difficulty: selectedTest.difficulty ?? "",
      durationMinutes: String(selectedTest.duration_minutes ?? 20),
      published: selectedTest.published,
    });
  }, [selectedTest]);

  function setStatus(tone: NoticeTone, message: string) {
    setNotice({ tone, message });
  }

  function updateLocalPreviewUrl(value: string) {
    localPreviewUrlRef.current = value;
    setLocalPreviewUrl(value);
  }

  async function loadBuilderData(preferredTestId?: string) {
    setLoading(true);
    setStatus("", "");
    try {
      const [setsResult, questionsResult, optionsResult, itemsResult] =
        await Promise.all([
          supabase.from("question_sets").select("*").order("created_at", { ascending: false }),
          supabase.from("questions").select("*").order("created_at", { ascending: false }),
          supabase.from("question_options").select("*"),
          supabase.from("question_set_items").select("*").order("position", { ascending: true }),
        ]);

      if (setsResult.error) throw setsResult.error;
      if (questionsResult.error) throw questionsResult.error;
      if (optionsResult.error) throw optionsResult.error;
      if (itemsResult.error) throw itemsResult.error;

      const nextTests = (setsResult.data ?? []) as TestRow[];
      setTests(nextTests);
      setQuestions((questionsResult.data ?? []) as QuestionRow[]);
      setOptions((optionsResult.data ?? []) as OptionRow[]);
      setItems((itemsResult.data ?? []) as TestItemRow[]);
      setSelectedTestId(preferredTestId || selectedTestId || nextTests[0]?.id || "");
    } catch (error) {
      setStatus(
        "error",
        error instanceof Error ? error.message : "Online test verileri yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  }

  async function revalidateTests(slug?: string) {
    try {
      await fetch("/api/revalidate-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testSlug: slug }),
      });
    } catch {
      // Cache refresh is best-effort; admin save should not fail.
    }
  }

  function resetQuestionForm() {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }
    setQuestionForm(initialQuestionForm);
    setImageFile(null);
    updateLocalPreviewUrl("");
    setImageInputKey((value) => value + 1);
    setEditingQuestionId("");
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("error", "Yalnızca görsel dosyası yükleyebilirsin.");
      setImageInputKey((value) => value + 1);
      return;
    }

    if (file.size > maxImageSize) {
      setStatus("error", "Soru görseli en fazla 5 MB olabilir.");
      setImageInputKey((value) => value + 1);
      return;
    }

    if (localPreviewUrlRef.current) URL.revokeObjectURL(localPreviewUrlRef.current);
    setImageFile(file);
    updateLocalPreviewUrl(URL.createObjectURL(file));
    setQuestionForm((current) => ({
      ...current,
      imageUrl: "",
      cropMode: "none",
      cropX: 50,
      cropY: 50,
      cropZoom: 100,
    }));
    setStatus("warning", "Görsel seçildi. Kırpma modunu açıp önizleme üzerinde ayarlayabilirsin.");
  }

  function handleQuestionImageUrlChange(value: string) {
    if (localPreviewUrlRef.current) URL.revokeObjectURL(localPreviewUrlRef.current);
    setImageFile(null);
    updateLocalPreviewUrl("");
    setQuestionForm((current) => ({
      ...current,
      imageUrl: value,
      cropMode: "none",
    }));
  }

  async function applyImageCrop() {
    if (!imageFile || questionForm.cropMode === "none") return;

    let sourceX: number, sourceY: number, cropWidth: number, cropHeight: number;
    let canvasWidth: number, canvasHeight: number;

    const bitmap = await createImageBitmap(imageFile);

    if (questionForm.cropMode === "free") {
      const { x, y, w, h } = questionForm.freeCropRect;
      sourceX = (x / 100) * bitmap.width;
      sourceY = (y / 100) * bitmap.height;
      cropWidth = Math.round((w / 100) * bitmap.width);
      cropHeight = Math.round((h / 100) * bitmap.height);
      canvasWidth = cropWidth;
      canvasHeight = cropHeight;
    } else {
      const size = cropSizes[questionForm.cropMode];
      const aspect = size.width / size.height;
      let cw = bitmap.width;
      let ch = cw / aspect;

      if (ch > bitmap.height) {
        ch = bitmap.height;
        cw = ch * aspect;
      }

      const zoom = Math.min(2.4, Math.max(1, questionForm.cropZoom / 100));
      cw /= zoom;
      ch /= zoom;

      sourceX = Math.max(0, bitmap.width - cw) * (questionForm.cropX / 100);
      sourceY = Math.max(0, bitmap.height - ch) * (questionForm.cropY / 100);
      cropWidth = cw;
      cropHeight = ch;
      canvasWidth = size.width;
      canvasHeight = size.height;
    }

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      setStatus("error", "Görsel kırpma başlatılamadı.");
      return;
    }

    context.drawImage(bitmap, sourceX, sourceY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.92)
    );

    if (!blob) {
      setStatus("error", "Görsel kırpma tamamlanamadı.");
      return;
    }

    const croppedFile = new File(
      [blob],
      `${imageFile.name.replace(/\.[^.]+$/, "")}-kirpildi.webp`,
      { type: "image/webp" }
    );

    if (localPreviewUrlRef.current) URL.revokeObjectURL(localPreviewUrlRef.current);
    setImageFile(croppedFile);
    updateLocalPreviewUrl(URL.createObjectURL(croppedFile));
    setQuestionForm((current) => ({
      ...current,
      cropMode: "none",
      cropX: 50,
      cropY: 50,
      cropZoom: 100,
      freeCropRect: { x: 10, y: 10, w: 80, h: 80 },
    }));
    setStatus("success", "Kırpma uygulandı. Kaydettiğinde kırpılmış görsel yüklenecek.");
  }

  async function uploadQuestionImageIfNeeded() {
    if (!imageFile) return questionForm.imageUrl.trim() || null;

    const extension = getFileExtension(imageFile);
    const path = `documents/questions/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("document-covers")
      .upload(path, imageFile, {
        cacheControl: "3600",
        contentType: imageFile.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("document-covers").getPublicUrl(path);
    return data.publicUrl;
  }

  async function publishAttachedQuestions(testId: string) {
    const questionIds = items
      .filter((item) => item.question_set_id === testId)
      .map((item) => item.question_id);

    if (questionIds.length === 0) return;

    const { error } = await supabase
      .from("questions")
      .update({ published: true })
      .in("id", questionIds);

    if (error) throw error;
  }

  async function saveTest() {
    setStatus("", "");

    if (!testForm.title.trim() || !testForm.topic) {
      setStatus("error", "Test başlığı ve konu alanı zorunludur.");
      return;
    }

    if (testForm.published && !selectedTest) {
      setStatus("error", "Yeni testi önce taslak olarak oluştur, sonra soruları ekleyip yayına al.");
      return;
    }

    if (testForm.published && selectedTest && selectedQuestions.length === 0) {
      setStatus("error", "Yayına almak için en az bir soru eklenmelidir.");
      return;
    }

    if (
      selectedTest &&
      selectedQuestions.length > 0 &&
      (testForm.grade !== selectedTest.grade || testForm.topic !== selectedTest.topic)
    ) {
      setStatus(
        "error",
        "Soru eklenmiş testte sınıf veya konu değiştirilemez. Önce soruları çıkar veya yeni test oluştur."
      );
      return;
    }

    const duration = Number(testForm.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 240) {
      setStatus("error", "Toplam süre 1 ile 240 dakika arasında olmalıdır.");
      return;
    }

    setSavingTest(true);
    try {
      const payload = {
        title: testForm.title.trim(),
        description: testForm.description.trim() || null,
        grade: testForm.grade,
        topic: testForm.topic,
        difficulty: testForm.difficulty || null,
        duration_minutes: duration,
        published: testForm.published,
      };

      if (selectedTest) {
        const { error } = await supabase
          .from("question_sets")
          .update(payload)
          .eq("id", selectedTest.id);

        if (error) throw error;
        if (testForm.published) await publishAttachedQuestions(selectedTest.id);
        setStatus("success", "Test ayarları güncellendi.");
        await revalidateTests(selectedTest.slug);
        await loadBuilderData(selectedTest.id);
      } else {
        const { data, error } = await supabase
          .from("question_sets")
          .insert({
            id: crypto.randomUUID(),
            slug: `${slugifyTr(testForm.title)}-${Date.now()}`,
            ...payload,
          })
          .select("id, slug")
          .single();

        if (error) throw error;
        setStatus("success", "Yeni test oluşturuldu. Şimdi soruları ekleyebilirsin.");
        await revalidateTests(data.slug);
        await loadBuilderData(data.id);
      }
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Test kaydedilemedi.");
    } finally {
      setSavingTest(false);
    }
  }

  async function toggleSelectedTestPublication(nextPublished: boolean) {
    if (!selectedTest) return;

    setSavingTest(true);
    setStatus("", "");
    try {
      if (nextPublished) await publishAttachedQuestions(selectedTest.id);

      const { error } = await supabase
        .from("question_sets")
        .update({ published: nextPublished })
        .eq("id", selectedTest.id);

      if (error) throw error;
      setStatus("success", nextPublished ? "Test yayına alındı." : "Test yayından çıkarıldı.");
      await revalidateTests(selectedTest.slug);
      await loadBuilderData(selectedTest.id);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Yayın durumu değiştirilemedi.");
    } finally {
      setSavingTest(false);
    }
  }

  function startNewTest() {
    setSelectedTestId("");
    setTestForm(initialTestForm);
    resetQuestionForm();
    setStatus("warning", "Yeni test modundasın. Önce test ayarlarını kaydet.");
  }

  function editQuestion(question: QuestionRow) {
    const questionOptions = optionsByQuestion.get(question.id) ?? [];
    setEditingQuestionId(question.id);
    setQuestionForm({
      text: question.question_text,
      imageUrl: question.question_image_url ?? "",
      solution: question.solution_text ?? "",
      options: optionLabels.map(
        (label) => questionOptions.find((option) => option.label === label)?.text ?? ""
      ),
      correct: questionOptions.find((option) => option.is_correct)?.label ?? "A",
      cropMode: "none",
      cropX: 50,
      cropY: 50,
      cropZoom: 100,
      freeCropRect: { x: 10, y: 10, w: 80, h: 80 },
    });
    setImageFile(null);
    if (localPreviewUrlRef.current) URL.revokeObjectURL(localPreviewUrlRef.current);
    updateLocalPreviewUrl("");
    setImageInputKey((value) => value + 1);
    setStatus("warning", "Soru düzenleme modundasın.");
  }

  function updateQuestionOption(index: number, value: string) {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, itemIndex) =>
        itemIndex === index ? value : option
      ),
    }));
  }

  async function saveQuestionToTest() {
    if (!selectedTest) {
      setStatus("error", "Önce bir test oluştur veya mevcut testi seç.");
      return;
    }

    if (
      questionForm.text.trim().length < 8 ||
      questionForm.options.some((option) => !option.trim())
    ) {
      setStatus("error", "Soru metni ve dört seçenek dolu olmalıdır.");
      return;
    }

    if (!imageFile && !isValidHttpUrl(questionForm.imageUrl)) {
      setStatus("error", "Soru görseli için geçerli bir http/https URL gir.");
      return;
    }

    setSavingQuestion(true);
    setStatus("", "");

    try {
      const uploadedImageUrl = await uploadQuestionImageIfNeeded();
      const questionId = editingQuestionId || crypto.randomUUID();
      const questionPayload = {
        grade: selectedTest.grade,
        topic: selectedTest.topic,
        difficulty: selectedTest.difficulty,
        question_text: questionForm.text.trim(),
        question_image_url: uploadedImageUrl,
        solution_text: questionForm.solution.trim() || null,
        published: selectedTest.published,
      };

      if (editingQuestionId) {
        const { error: questionError } = await supabase
          .from("questions")
          .update(questionPayload)
          .eq("id", editingQuestionId);

        if (questionError) throw questionError;
      } else {
        const { error: questionError } = await supabase.from("questions").insert({
          id: questionId,
          ...questionPayload,
        });

        if (questionError) throw questionError;
      }

      const currentOptions = editingQuestionId
        ? optionsByQuestion.get(editingQuestionId) ?? []
        : [];

      const optionResults = await Promise.all(
        optionLabels.map((label, index) => {
          const payload = {
            question_id: questionId,
            label,
            text: questionForm.options[index].trim(),
            is_correct: label === questionForm.correct,
          };
          const existingOption = currentOptions.find(
            (option) => option.label === label
          );

          if (existingOption) {
            return supabase
              .from("question_options")
              .update(payload)
              .eq("id", existingOption.id);
          }

          return supabase.from("question_options").insert(payload);
        })
      );

      const optionsError = optionResults.find((result) => result.error)?.error;
      if (optionsError) throw optionsError;

      if (!editingQuestionId) {
        const nextPosition =
          selectedItems.reduce((max, item) => Math.max(max, item.position), -10) + 10;
        const { error: itemError } = await supabase.from("question_set_items").insert({
          question_set_id: selectedTest.id,
          question_id: questionId,
          position: nextPosition,
        });

        if (itemError) throw itemError;
      }

      setStatus("success", editingQuestionId ? "Soru güncellendi." : "Soru teste eklendi.");
      resetQuestionForm();
      await revalidateTests(selectedTest.slug);
      await loadBuilderData(selectedTest.id);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Soru kaydedilemedi.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function addExistingQuestion(questionId: string) {
    if (!selectedTest || attachedQuestionIds.has(questionId)) return;

    setSavingQuestion(true);
    setStatus("", "");
    try {
      const nextPosition =
        selectedItems.reduce((max, item) => Math.max(max, item.position), -10) + 10;
      const { error } = await supabase.from("question_set_items").insert({
        question_set_id: selectedTest.id,
        question_id: questionId,
        position: nextPosition,
      });

      if (error) throw error;
      setStatus("success", "Mevcut soru teste eklendi.");
      await revalidateTests(selectedTest.slug);
      await loadBuilderData(selectedTest.id);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Soru teste eklenemedi.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function removeQuestionFromTest(questionId: string) {
    if (!selectedTest) return;

    setSavingQuestion(true);
    setStatus("", "");
    try {
      const { error } = await supabase
        .from("question_set_items")
        .delete()
        .eq("question_set_id", selectedTest.id)
        .eq("question_id", questionId);

      if (error) throw error;
      setStatus("success", "Soru testten çıkarıldı.");
      await revalidateTests(selectedTest.slug);
      await loadBuilderData(selectedTest.id);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Soru testten çıkarılamadı.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function moveQuestion(questionId: string, direction: -1 | 1) {
    if (!selectedTest) return;

    const index = selectedItems.findIndex((item) => item.question_id === questionId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= selectedItems.length) return;

    const reordered = [...selectedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setSavingQuestion(true);

    try {
      const results = await Promise.all(
        reordered.map((item, itemIndex) =>
          supabase
            .from("question_set_items")
            .update({ position: itemIndex * 10 })
            .eq("question_set_id", selectedTest.id)
            .eq("question_id", item.question_id)
        )
      );
      const error = results.find((result) => result.error)?.error;
      if (error) throw error;
      await revalidateTests(selectedTest.slug);
      await loadBuilderData(selectedTest.id);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Soru sırası güncellenemedi.");
    } finally {
      setSavingQuestion(false);
    }
  }

  const cropPreviewStyle = {
    objectPosition: `${questionForm.cropX}% ${questionForm.cropY}%`,
    transform: `scale(${questionForm.cropZoom / 100})`,
  } satisfies React.CSSProperties;

  const selectedQuestionCount = selectedQuestions.length;
  const canPublishSelectedTest = Boolean(selectedTest && selectedQuestionCount > 0);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="ONLINE TEST OLUŞTURUCU"
        title="Testleri oluştur, düzenle ve yayına al"
        description="Süreyi, yayın durumunu ve soruları tek ekrandan yönet. Her teste sınırsız soru ekleyebilir, görselleri önizleyebilir ve kırpabilirsin."
        actions={
          <button
            type="button"
            onClick={startNewTest}
            className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5"
          >
            Yeni Test
          </button>
        }
      />

      {notice.message ? (
        <div className="mt-5">
          <InlineNotice
            tone={
              notice.tone === "success"
                ? "success"
                : notice.tone === "warning"
                  ? "warning"
                  : "error"
            }
          >
            {notice.message}
          </InlineNotice>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3">
            <input
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              placeholder="Test ara"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={testGradeFilter}
                onChange={(e) => setTestGradeFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="">Tüm sınıflar</option>
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf</option>
              </select>
              <select
                value={testStatusFilter}
                onChange={(e) => setTestStatusFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="">Tüm durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
            </div>
          </div>

          <div className="mt-4 max-h-[650px] space-y-3 overflow-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-500">
                Testler yükleniyor...
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm font-semibold text-slate-500">
                Filtreye uygun test yok.
              </div>
            ) : (
              filteredTests.map((test) => {
                const questionCount = items.filter(
                  (item) => item.question_set_id === test.id
                ).length;
                const active = test.id === selectedTestId;

                return (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => {
                      setSelectedTestId(test.id);
                      resetQuestionForm();
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-blue-300 bg-white shadow-md shadow-blue-900/10"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-slate-950">
                          {test.title}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                          {test.grade}. Sınıf · {questionCount} soru ·{" "}
                          {test.duration_minutes ?? 20} dk
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          test.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {test.published ? "Yayında" : "Taslak"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                      <span>{test.topic}</span>
                      {test.difficulty ? <span>{test.difficulty}</span> : null}
                      <span>{formatDate(test.created_at)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
                  Test ayarları
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Başlık, konu, süre ve yayın durumunu buradan yönet.
                </p>
              </div>
              {selectedTest ? (
                <button
                  type="button"
                  disabled={savingTest || !canPublishSelectedTest}
                  onClick={() => toggleSelectedTestPublication(!selectedTest.published)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedTest.published
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {selectedTest.published ? "Yayından Çıkar" : "Yayına Al"}
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                value={testForm.title}
                onChange={(e) =>
                  setTestForm((current) => ({ ...current, title: e.target.value }))
                }
                placeholder="Test başlığı"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 md:col-span-2"
              />
              <select
                value={testForm.grade}
                onChange={(e) => {
                  const grade = e.target.value as GradeLevel;
                  setTestForm((current) => ({ ...current, grade, topic: "" }));
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf</option>
              </select>
              <input
                type="number"
                min={1}
                max={240}
                value={testForm.durationMinutes}
                onChange={(e) =>
                  setTestForm((current) => ({
                    ...current,
                    durationMinutes: e.target.value,
                  }))
                }
                placeholder="Süre"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              />
              <select
                value={testForm.topic}
                onChange={(e) =>
                  setTestForm((current) => ({ ...current, topic: e.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 md:col-span-2"
              >
                <option value="">Konu seç</option>
                {testTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <select
                value={testForm.difficulty}
                onChange={(e) =>
                  setTestForm((current) => ({
                    ...current,
                    difficulty: e.target.value as TestForm["difficulty"],
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="">Zorluk yok</option>
                {documentDifficultyCatalog.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={testForm.published}
                  onChange={(e) =>
                    setTestForm((current) => ({
                      ...current,
                      published: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                Kaydederken yayında olsun
              </label>
              <textarea
                value={testForm.description}
                onChange={(e) =>
                  setTestForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Test açıklaması"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 md:col-span-2 xl:col-span-4"
              />
            </div>

            <button
              type="button"
              onClick={saveTest}
              disabled={savingTest}
              className="mt-5 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingTest
                ? "Kaydediliyor..."
                : selectedTest
                  ? "Testi Güncelle"
                  : "Testi Oluştur"}
            </button>
            {selectedTest && !canPublishSelectedTest ? (
              <p className="mt-3 text-xs font-semibold text-amber-700">
                Yayına almak için en az bir soru eklenmelidir.
              </p>
            ) : null}
          </div>

          <div className="grid gap-6 2xl:grid-cols-[1fr_0.95fr]">
            <TestQuestionsPanel
              questions={selectedQuestions}
              optionsByQuestion={optionsByQuestion}
              saving={savingQuestion}
              selectedTest={selectedTest}
              onEdit={editQuestion}
              onMove={moveQuestion}
              onRemove={removeQuestionFromTest}
            />

            <QuestionEditor
              editingQuestionId={editingQuestionId}
              form={questionForm}
              imagePreviewUrl={imagePreviewUrl}
              imageInputKey={imageInputKey}
              imageFile={imageFile}
              cropPreviewStyle={cropPreviewStyle}
              saving={savingQuestion}
              selectedTest={selectedTest}
              onCancel={resetQuestionForm}
              onChange={setQuestionForm}
              onImageFileChange={handleImageFileChange}
              onImageUrlChange={handleQuestionImageUrlChange}
              onCrop={applyImageCrop}
              onOptionChange={updateQuestionOption}
              onSave={saveQuestionToTest}
            />
          </div>

          <ExistingQuestionPicker
            selectedTest={selectedTest}
            questionPool={questionPool}
            questionSearch={questionSearch}
            saving={savingQuestion}
            onSearch={setQuestionSearch}
            onAdd={addExistingQuestion}
          />
        </div>
      </div>
    </section>
  );
}

function TestQuestionsPanel({
  questions,
  optionsByQuestion,
  saving,
  selectedTest,
  onEdit,
  onMove,
  onRemove,
}: {
  questions: QuestionRow[];
  optionsByQuestion: Map<string, OptionRow[]>;
  saving: boolean;
  selectedTest: TestRow | null;
  onEdit: (question: QuestionRow) => void;
  onMove: (questionId: string, direction: -1 | 1) => void;
  onRemove: (questionId: string) => void;
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
            Test soruları
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Soruları sırala, düzenle veya testten çıkar.
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-800">
          {questions.length} soru
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {!selectedTest ? (
          <EmptyBox>Önce test seç veya yeni test oluştur.</EmptyBox>
        ) : questions.length === 0 ? (
          <EmptyBox>Bu testte henüz soru yok.</EmptyBox>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-sm font-black text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-bold text-slate-900">
                    {question.question_text}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold">
                    {question.question_image_url ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                        Görsel var
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-3 py-1 ${
                        question.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {question.published ? "Yayında" : "Taslak"}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                      {optionsByQuestion.get(question.id)?.length ?? 0} seçenek
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={index === 0 || saving}
                  onClick={() => onMove(question.id, -1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Yukarı
                </button>
                <button
                  type="button"
                  disabled={index === questions.length - 1 || saving}
                  onClick={() => onMove(question.id, 1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Aşağı
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(question)}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onRemove(question.id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-40"
                >
                  Çıkar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EmptyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
      {children}
    </div>
  );
}

function QuestionEditor({
  editingQuestionId,
  form,
  imagePreviewUrl,
  imageInputKey,
  imageFile,
  cropPreviewStyle,
  saving,
  selectedTest,
  onCancel,
  onChange,
  onImageFileChange,
  onImageUrlChange,
  onCrop,
  onOptionChange,
  onSave,
}: {
  editingQuestionId: string;
  form: QuestionForm;
  imagePreviewUrl: string;
  imageInputKey: number;
  imageFile: File | null;
  cropPreviewStyle: React.CSSProperties;
  saving: boolean;
  selectedTest: TestRow | null;
  onCancel: () => void;
  onChange: React.Dispatch<React.SetStateAction<QuestionForm>>;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlChange: (value: string) => void;
  onCrop: () => void;
  onOptionChange: (index: number, value: string) => void;
  onSave: () => void;
})
 {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
            {editingQuestionId ? "Soruyu düzenle" : "Yeni soru ekle"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Soru görseli, seçenekler ve doğru cevap burada tanımlanır.
          </p>
        </div>
        {editingQuestionId ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
          >
            İptal
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <textarea
          value={form.text}
          onChange={(e) =>
            onChange((current) => ({ ...current, text: e.target.value }))
          }
          rows={4}
          placeholder="Soru metni"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3">
            <input
              key={imageInputKey}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={onImageFileChange}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-900"
            />
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="Soru görseli URL adresi"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            />
          </div>

          {imagePreviewUrl ? (
            <div className="mt-4">
              {form.cropMode === "free" ? (
                <InteractiveCropOverlay
                  imageUrl={imagePreviewUrl}
                  rect={form.freeCropRect}
                  onChange={(rect) =>
                    onChange((current) => ({ ...current, freeCropRect: rect }))
                  }
                />
              ) : (
                <div
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${
                    form.cropMode === "none"
                      ? "p-3"
                      : form.cropMode === "square"
                        ? "aspect-square"
                        : form.cropMode === "wide"
                          ? "aspect-video"
                          : "aspect-[4/3]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl}
                    alt="Soru görseli önizleme"
                    style={form.cropMode === "none" ? undefined : cropPreviewStyle}
                    className={
                      form.cropMode === "none"
                        ? "mx-auto max-h-[320px] max-w-full object-contain"
                        : "h-full w-full object-cover transition"
                    }
                  />
                </div>
              )}

              <div className="mt-3 grid gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3">
                <select
                  value={form.cropMode}
                  onChange={(e) =>
                    onChange((current) => ({
                      ...current,
                      cropMode: e.target.value as CropMode,
                    }))
                  }
                  className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
                >
                  <option value="none">Orijinal göster</option>
                  <option value="free">Serbest kırp (sürükle)</option>
                  <option value="wide">{cropSizes.wide.label}</option>
                  <option value="standard">{cropSizes.standard.label}</option>
                  <option value="square">{cropSizes.square.label}</option>
                </select>

                {form.cropMode === "free" ? (
                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-blue-800">
                      Köşeleri ve kenarları sürükleyerek kırpma alanını ayarla.
                    </p>
                    <button
                      type="button"
                      onClick={onCrop}
                      disabled={!imageFile}
                      className="rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Kırpmayı Uygula
                    </button>
                  </div>
                ) : form.cropMode !== "none" ? (
                  <>
                    <label className="text-xs font-bold text-blue-900">
                      Yakınlaştır
                      <input
                        type="range"
                        min={100}
                        max={240}
                        value={form.cropZoom}
                        onChange={(e) =>
                          onChange((current) => ({
                            ...current,
                            cropZoom: Number(e.target.value),
                          }))
                        }
                        className="mt-2 w-full"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-xs font-bold text-blue-900">
                        Yatay konum
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={form.cropX}
                          onChange={(e) =>
                            onChange((current) => ({
                              ...current,
                              cropX: Number(e.target.value),
                            }))
                          }
                          className="mt-2 w-full"
                        />
                      </label>
                      <label className="text-xs font-bold text-blue-900">
                        Dikey konum
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={form.cropY}
                          onChange={(e) =>
                            onChange((current) => ({
                              ...current,
                              cropY: Number(e.target.value),
                            }))
                          }
                          className="mt-2 w-full"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={onCrop}
                      disabled={!imageFile}
                      className="rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Kırpmayı Uygula
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
              Soru görseli eklenmedi.
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {optionLabels.map((label, index) => (
            <label
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-3"
            >
              <span className="mb-2 block text-xs font-bold text-slate-500">
                Seçenek {label}
              </span>
              <input
                value={form.options[index]}
                onChange={(e) => onOptionChange(index, e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>
          ))}
        </div>

        <select
          value={form.correct}
          onChange={(e) =>
            onChange((current) => ({ ...current, correct: e.target.value }))
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        >
          {optionLabels.map((label) => (
            <option key={label} value={label}>
              Doğru cevap: {label}
            </option>
          ))}
        </select>

        <textarea
          value={form.solution}
          onChange={(e) =>
            onChange((current) => ({ ...current, solution: e.target.value }))
          }
          rows={3}
          placeholder="Çözüm açıklaması"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        />

        <button
          type="button"
          disabled={saving || !selectedTest}
          onClick={onSave}
          className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Kaydediliyor..."
            : editingQuestionId
              ? "Soruyu Güncelle"
              : "Soruyu Teste Ekle"}
        </button>
      </div>
    </div>
  );
}

function ExistingQuestionPicker({
  selectedTest,
  questionPool,
  questionSearch,
  saving,
  onSearch,
  onAdd,
}: {
  selectedTest: TestRow | null;
  questionPool: QuestionRow[];
  questionSearch: string;
  saving: boolean;
  onSearch: (value: string) => void;
  onAdd: (questionId: string) => void;
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
            Mevcut sorulardan ekle
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Seçili testin sınıf ve konusuna uygun sorular listelenir.
          </p>
        </div>
        <input
          value={questionSearch}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Soru ara"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {!selectedTest ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 md:col-span-2 xl:col-span-3">
            Mevcut soru eklemek için test seç.
          </div>
        ) : questionPool.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 md:col-span-2 xl:col-span-3">
            Eklenebilir uygun soru bulunamadı.
          </div>
        ) : (
          questionPool.map((question) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="line-clamp-3 text-sm font-bold leading-6 text-slate-900">
                {question.question_text}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                {question.question_image_url ? <span>Görsel</span> : null}
                <span>{question.difficulty ?? "Zorluk yok"}</span>
                <span>{formatDate(question.created_at)}</span>
              </div>
              <button
                type="button"
                onClick={() => onAdd(question.id)}
                disabled={saving}
                className="mt-4 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-50"
              >
                Bu Teste Ekle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type DragType = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function InteractiveCropOverlay({
  imageUrl,
  rect,
  onChange,
}: {
  imageUrl: string;
  rect: FreeCropRect;
  onChange: (rect: FreeCropRect) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    type: DragType;
    startX: number;
    startY: number;
    startRect: FreeCropRect;
  } | null>(null);

  function startDrag(e: React.PointerEvent, type: DragType) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { type, startX: e.clientX, startY: e.clientY, startRect: { ...rect } };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / bounds.width) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / bounds.height) * 100;
    const sr = dragRef.current.startRect;
    const MIN = 5;
    let { x, y, w, h } = sr;

    switch (dragRef.current.type) {
      case "move":
        x = Math.max(0, Math.min(100 - sr.w, sr.x + dx));
        y = Math.max(0, Math.min(100 - sr.h, sr.y + dy));
        break;
      case "e":
        w = Math.max(MIN, Math.min(100 - sr.x, sr.w + dx));
        break;
      case "w":
        x = Math.max(0, Math.min(sr.x + sr.w - MIN, sr.x + dx));
        w = sr.x + sr.w - x;
        break;
      case "s":
        h = Math.max(MIN, Math.min(100 - sr.y, sr.h + dy));
        break;
      case "n":
        y = Math.max(0, Math.min(sr.y + sr.h - MIN, sr.y + dy));
        h = sr.y + sr.h - y;
        break;
      case "ne":
        y = Math.max(0, Math.min(sr.y + sr.h - MIN, sr.y + dy));
        h = sr.y + sr.h - y;
        w = Math.max(MIN, Math.min(100 - sr.x, sr.w + dx));
        break;
      case "nw":
        y = Math.max(0, Math.min(sr.y + sr.h - MIN, sr.y + dy));
        h = sr.y + sr.h - y;
        x = Math.max(0, Math.min(sr.x + sr.w - MIN, sr.x + dx));
        w = sr.x + sr.w - x;
        break;
      case "se":
        h = Math.max(MIN, Math.min(100 - sr.y, sr.h + dy));
        w = Math.max(MIN, Math.min(100 - sr.x, sr.w + dx));
        break;
      case "sw":
        h = Math.max(MIN, Math.min(100 - sr.y, sr.h + dy));
        x = Math.max(0, Math.min(sr.x + sr.w - MIN, sr.x + dx));
        w = sr.x + sr.w - x;
        break;
    }

    onChange({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      w: Math.round(w * 10) / 10,
      h: Math.round(h * 10) / 10,
    });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  const H = 10;
  const handles: Array<{ type: DragType; top: string; left: string; cursor: string }> = [
    { type: "nw", top: `calc(${rect.y}% - ${H / 2}px)`, left: `calc(${rect.x}% - ${H / 2}px)`, cursor: "nwse-resize" },
    { type: "ne", top: `calc(${rect.y}% - ${H / 2}px)`, left: `calc(${rect.x + rect.w}% - ${H / 2}px)`, cursor: "nesw-resize" },
    { type: "sw", top: `calc(${rect.y + rect.h}% - ${H / 2}px)`, left: `calc(${rect.x}% - ${H / 2}px)`, cursor: "nesw-resize" },
    { type: "se", top: `calc(${rect.y + rect.h}% - ${H / 2}px)`, left: `calc(${rect.x + rect.w}% - ${H / 2}px)`, cursor: "nwse-resize" },
    { type: "n", top: `calc(${rect.y}% - ${H / 2}px)`, left: `calc(${rect.x + rect.w / 2}% - ${H / 2}px)`, cursor: "ns-resize" },
    { type: "s", top: `calc(${rect.y + rect.h}% - ${H / 2}px)`, left: `calc(${rect.x + rect.w / 2}% - ${H / 2}px)`, cursor: "ns-resize" },
    { type: "e", top: `calc(${rect.y + rect.h / 2}% - ${H / 2}px)`, left: `calc(${rect.x + rect.w}% - ${H / 2}px)`, cursor: "ew-resize" },
    { type: "w", top: `calc(${rect.y + rect.h / 2}% - ${H / 2}px)`, left: `calc(${rect.x}% - ${H / 2}px)`, cursor: "ew-resize" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl border border-slate-200"
      style={{ touchAction: "none" }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="Kırpma önizleme" className="block h-auto w-full" draggable={false} />

      {/* Dark overlay — top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-black/55" style={{ height: `${rect.y}%` }} />
      {/* Dark overlay — bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55" style={{ height: `${100 - rect.y - rect.h}%` }} />
      {/* Dark overlay — left */}
      <div className="pointer-events-none absolute left-0 bg-black/55" style={{ top: `${rect.y}%`, height: `${rect.h}%`, width: `${rect.x}%` }} />
      {/* Dark overlay — right */}
      <div className="pointer-events-none absolute right-0 bg-black/55" style={{ top: `${rect.y}%`, height: `${rect.h}%`, width: `${100 - rect.x - rect.w}%` }} />

      {/* Crop region border + move handle */}
      <div
        className="absolute border-2 border-white"
        style={{
          left: `${rect.x}%`,
          top: `${rect.y}%`,
          width: `${rect.w}%`,
          height: `${rect.h}%`,
          cursor: "move",
        }}
        onPointerDown={(e) => startDrag(e, "move")}
      >
        {/* Rule-of-thirds grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 top-0 border-r border-white/30" style={{ left: "33.33%" }} />
          <div className="absolute bottom-0 top-0 border-r border-white/30" style={{ left: "66.66%" }} />
          <div className="absolute left-0 right-0 border-b border-white/30" style={{ top: "33.33%" }} />
          <div className="absolute left-0 right-0 border-b border-white/30" style={{ top: "66.66%" }} />
        </div>
      </div>

      {/* Resize handles */}
      {handles.map(({ type, top, left, cursor }) => (
        <div
          key={type}
          className="absolute z-10 rounded-sm border-2 border-blue-500 bg-white"
          style={{ top, left, width: H, height: H, cursor }}
          onPointerDown={(e) => startDrag(e, type)}
        />
      ))}
    </div>
  );
}
