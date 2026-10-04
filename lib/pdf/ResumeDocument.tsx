import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

export type PolishedResumeData = {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentTitle?: string | null;
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    period: string;
    bullets: string[];
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year?: string | null;
  }>;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 32,
    paddingRight: 32,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#475569",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  contactItem: {
    fontSize: 8.5,
    color: "#64748b",
    marginRight: 6,
  },
  contactLink: {
    fontSize: 8.5,
    color: "#2563eb",
    textDecoration: "none",
  },
  contactDot: {
    fontSize: 8,
    color: "#94a3b8",
    marginRight: 6,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 3,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: "#334155",
  },
  roleBlock: {
    marginBottom: 6,
  },
  roleTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1.5,
  },
  roleTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  roleDates: {
    fontSize: 8,
    color: "#64748b",
  },
  roleCompany: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Oblique",
    color: "#475569",
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletSymbol: {
    width: 8,
    fontSize: 8,
    color: "#475569",
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
    color: "#334155",
  },
  skillsText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#334155",
  },
  eduBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  eduDegree: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  eduSchool: {
    fontSize: 8.5,
    color: "#475569",
  },
  eduYear: {
    fontSize: 8,
    color: "#64748b",
  },
});

export function ResumeDocument({ data }: { data: PolishedResumeData }) {
  const contactEntries: Array<{ label: string; isLink?: boolean }> = [];

  if (data.email) {
    contactEntries.push({ label: data.email });
  }
  if (data.phone) {
    contactEntries.push({ label: data.phone });
  }
  if (data.location) {
    contactEntries.push({ label: data.location });
  }
  if (data.linkedinUrl) {
    contactEntries.push({ label: data.linkedinUrl, isLink: true });
  }
  if (data.portfolioUrl) {
    contactEntries.push({ label: data.portfolioUrl, isLink: true });
  }

  return (
    <Document title={`${data.fullName || "Resume"} - Resume`} author={data.fullName}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.currentTitle ? (
            <Text style={styles.title}>{data.currentTitle}</Text>
          ) : null}

          <View style={styles.contactRow}>
            {contactEntries.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.isLink ? (
                  <Link src={item.label} style={styles.contactLink}>
                    {item.label.replace(/^https?:\/\/(www\.)?/, "")}
                  </Link>
                ) : (
                  <Text style={styles.contactItem}>{item.label}</Text>
                )}
                {idx < contactEntries.length - 1 ? (
                  <Text style={styles.contactDot}>|</Text>
                ) : null}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Work Experience</Text>
            {data.experience.map((exp, idx) => (
              <View key={idx} style={styles.roleBlock}>
                <View style={styles.roleTopRow}>
                  <Text style={styles.roleTitle}>{exp.title}</Text>
                  <Text style={styles.roleDates}>{exp.period}</Text>
                </View>
                <Text style={styles.roleCompany}>{exp.company}</Text>
                {exp.bullets.map((bullet, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Skills & Competencies</Text>
            <Text style={styles.skillsText}>{data.skills.join(" • ")}</Text>
          </View>
        ) : null}

        {/* Education */}
        {data.education && data.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Education</Text>
            {data.education.map((edu, idx) => (
              <View key={idx} style={styles.eduBlock}>
                <View>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.institution ? (
                    <Text style={styles.eduSchool}>{edu.institution}</Text>
                  ) : null}
                </View>
                {edu.year ? <Text style={styles.eduYear}>{edu.year}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
