"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { Markdown } from "@/components/custom/markdown";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import { toast } from 'sonner';

// Types
interface ApiResponse {
  method: string;
  args: Record<string, any>;
  data: string;
  headers: Record<string, string>;
}

interface MetaInfo {
  status: number;
  time: string;
  size: string;
}

// Sample data
const SAMPLE: { response: ApiResponse; meta: MetaInfo } = {
  response: {
    method: "GET",
    args: {},
    data: "Sample response data",
    headers: {
      "Content-Type": "application/json",
      "X-Powered-By": "Example",
    },
  },
  meta: {
    status: 200,
    time: "123ms",
    size: "1.2KB",
  },
};

// Component
export function ApiResponseViewer({
  response = SAMPLE.response,
  meta = SAMPLE.meta,
}: {
  response?: ApiResponse;
  meta?: MetaInfo;
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"json" | "headers" | "test-results">("json");
  const [copied, setCopied] = useState(false);

  const style = theme === "dark" ? tomorrowNight : atomOneLight;

  // Get current content for copying
  const getCurrentContent = () => {
    switch (activeTab) {
      case "json":
        try {
          return typeof response.data === "string"
            ? JSON.stringify({ ...response, data: JSON.parse(response.data) }, null, 2)
            : JSON.stringify(response, null, 2);
        } catch (e) {
          // If JSON parsing fails, return the raw data
          return JSON.stringify({ ...response, data: response.data }, null, 2);
        }
      case "headers":
        return Object.entries(response.headers)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      default:
        return "";
    }
  };

  // Handle save
  const handleSave = () => {
    const content = getCurrentContent();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${new Date().getTime()}.${activeTab === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render content based on active tab
  const renderContent = (tab: "json" | "headers" | "test-results") => {
    switch (tab) {
      case "json":
        return (
          <pre className="p-0 rounded bg-muted max-h-[500px] overflow-auto scrollbar-thin">
            <SyntaxHighlighter
              language="json"
              style={style}
              showLineNumbers={false}
              customStyle={{
                margin: 0,
                padding: "1rem",
                minWidth: "100%",
                width: "fit-content",
              }}
              wrapLongLines={true}
            >
              {(() => {
                try {
                  return typeof response.data === "string"
                    ? JSON.stringify({ ...response, data: JSON.parse(response.data) }, null, 2)
                    : JSON.stringify(response, null, 2);
                } catch (e) {
                  return JSON.stringify({ ...response, data: response.data }, null, 2);
                }
              })()}
            </SyntaxHighlighter>
          </pre>
        );
      case "headers":
        const markdownTable = `| Header | Value |
|-|-|
${Object.entries(response.headers)
  .map(([key, value]) => `| ${key} | ${value} |`)
  .join("\n")}`;

        return <Markdown>{markdownTable}</Markdown>;
      case "test-results":
        return <div className="text-muted-foreground italic">No test results available</div>;
      default:
        return null;
    }
  };

  return (
    <Card className="text-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center">
              <span className="font-medium mr-1">Status:</span>
              <span className="text-green-600">{meta.status}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-1">Time:</span>
              <span className="text-muted-foreground">{meta.time}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-1">Size:</span>
              <span className="text-muted-foreground">{meta.size}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="json" onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="test-results">Test Results</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <CopyToClipboard
                text={getCurrentContent()}
                onCopy={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Button variant="ghost" size="sm">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CopyToClipboard>
              <Button variant="ghost" size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
          <TabsContent value="json">{renderContent("json")}</TabsContent>
          <TabsContent value="headers">{renderContent("headers")}</TabsContent>
          <TabsContent value="test-results">{renderContent("test-results")}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
