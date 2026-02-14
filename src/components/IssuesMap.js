"use client";

import dynamic from "next/dynamic";

const IssuesMapClient = dynamic(
  () => import("./IssuesMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
        Loading map…
      </div>
    ),
  }
);

export default function IssuesMap(props) {
  return <IssuesMapClient {...props} />;
}
