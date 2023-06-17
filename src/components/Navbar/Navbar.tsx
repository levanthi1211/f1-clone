import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.scss";

const items: MenuProps["items"] = [
  {
    label: (
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${classes.link} ${isActive ? classes.active : ""}`
        }
      >
        Home
      </NavLink>
    ),
    key: "/",
  },
  {
    label: (
      <NavLink
        to="/races"
        className={({ isActive }) =>
          `${classes.link} ${isActive ? classes.active : ""}`
        }
      >
        Races
      </NavLink>
    ),
    key: "/races",
  },
  {
    label: (
      <NavLink
        to="/drivers"
        className={({ isActive }) =>
          `${classes.link} ${isActive ? classes.active : ""}`
        }
      >
        Drivers
      </NavLink>
    ),
    key: "/drivers",
  },
  {
    label: (
      <NavLink
        to="/teams"
        className={({ isActive }) =>
          `${classes.link} ${isActive ? classes.active : ""}`
        }
      >
        Teams
      </NavLink>
    ),
    key: "/teams",
  },
];

const Navbar: React.FC = () => {
  return (
    <Menu
      mode="horizontal"
      items={items}
      style={{ flexGrow: 1 }}
      className={classes.menu}
    />
  );
};

export default Navbar;
