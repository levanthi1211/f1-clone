import React from "react";
import ReactDOM from "react-dom/client";
import "@/shared/styles/index.scss";
import { Routers } from "./shared/routes/Routers.tsx";
import { ConfigProvider } from "antd";
import { theme } from "./shared/theme.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <Routers />
    </ConfigProvider>
  </React.StrictMode>
);
