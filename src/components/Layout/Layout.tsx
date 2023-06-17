import React, { PropsWithChildren, useState } from "react";
import { Breadcrumb, Button, Layout } from "antd";
import Navbar from "../Navbar/Navbar";
import classes from "./Layout.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { Search } from "../Search/Search";
import { useLocation, Link } from "react-router-dom";

const { Header, Content } = Layout;

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  console.log(pathSnippets);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const title =
      pathSnippets[index].charAt(0).toUpperCase() +
      pathSnippets[index].slice(1);
    if (index === pathSnippets.length - 1) {
      return {
        title,
      };
    }
    return {
      key: url,
      title: <Link to={url}>{title}</Link>,
    };
  });

  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
      key: "home",
    },
  ].concat(extraBreadcrumbItems as any);

  if (openSearch) {
    return <Search setOpenSearch={setOpenSearch} />;
  }
  return (
    <Layout className="layout">
      <Header className={classes.header}>
        <div className={classes.container}>
          <Navbar />
          <Button
            icon={<SearchOutlined className={classes.search_button_icon} />}
            type="default"
            danger
            className={classes.search_button}
            onClick={() => setOpenSearch(true)}
          />
        </div>
      </Header>
      <Content style={{ minHeight: "calc(100vh - 5rem)" }}>
        <Breadcrumb className={classes.breadcrumb} items={breadcrumbItems} />
        <div
          className="site-layout-content"
          style={{ background: "transparent" }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default BaseLayout;
