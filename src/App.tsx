import { useState } from "react";

export const App = () => {
  const [c, cc] = useState(1);
  return <button onClick={() => cc(c + 1)}>{c}</button>;
};
