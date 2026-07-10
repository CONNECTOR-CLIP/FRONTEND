import { Outlet } from "react-router-dom";

// 루트 컴포넌트 — 레이아웃 없이 Outlet만 렌더링, 실제 레이아웃은 router에서 LoginLayout/MainLayout이 담당
function App() {
  return <Outlet />;
}

export default App;
