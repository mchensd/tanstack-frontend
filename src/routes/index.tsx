import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  loader: () => ({
    date: new Date(),
  }),
  component: IndexComponent,
});

function IndexComponent() {
  const data = Route.useLoaderData();

  const [s, ss] = useState(1);
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>Data: {data.date.getDate()}</p>
      <button onClick={() => ss(s + 1)}>{s}</button>
    </div>
  );
}
