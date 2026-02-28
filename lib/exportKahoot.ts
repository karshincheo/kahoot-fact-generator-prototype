"use client";

import * as XLSX from "xlsx";
import { KahootQuestionRow } from "@/types/game";

type KahootSheetRow = {
  Question: string;
  "2.  Answer 1": string;
  "3.  Answer 2": string;
  "4.  Answer 3": string;
  "5.  Answer 4": string;
  "6.  Time limit (sec)": number;
  "Correct answer(s)": number;
};

export function exportKahootXlsx(rows: KahootQuestionRow[]) {
  const sheetRows: KahootSheetRow[] = rows.map((row) => ({
    Question: row.question,
    "2.  Answer 1": row.answer1,
    "3.  Answer 2": row.answer2,
    "4.  Answer 3": row.answer3,
    "5.  Answer 4": row.answer4,
    "6.  Time limit (sec)": 10,
    "Correct answer(s)": row.correctAnswer,
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetRows, {
    header: [
      "Question",
      "2.  Answer 1",
      "3.  Answer 2",
      "4.  Answer 3",
      "5.  Answer 4",
      "6.  Time limit (sec)",
      "Correct answer(s)",
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Kahoot Import");
  XLSX.writeFile(workbook, "kahoot_export.xlsx");
}
