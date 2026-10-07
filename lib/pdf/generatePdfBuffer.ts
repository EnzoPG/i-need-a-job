import React from "react";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { ResumeDocument, type PolishedResumeData } from "./ResumeDocument";

export async function generateResumePdfBuffer(
  data: PolishedResumeData
): Promise<Buffer> {
  const element = React.createElement(ResumeDocument, {
    data,
  }) as unknown as React.ReactElement<DocumentProps>;
  return await renderToBuffer(element);
}
