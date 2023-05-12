import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const state = useLocation();

  console.log(state);

  return <h1>Dashboard</h1>;
}
