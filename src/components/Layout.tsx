import Layout from "./Layout";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Control de Bodega</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
