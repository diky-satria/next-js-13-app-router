"use client";

import styles from "./navbar.module.scss";
import { useState } from "react";
import {
  drawerClose,
  drawerOpen,
  accordionActive,
  menuActive,
} from "@/redux/navbarMobile/action";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

// laptop
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
// laptop end

// handphone
import { Button, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// handphone end

// handphone
const items: MenuProps["items"] = [
  {
    key: "1",
    label: <Link href="/auth/login">Login</Link>,
  },
  {
    key: "2",
    label: "sub menu",
    children: [
      {
        key: "2-1",
        label: <Link href="/product">Product</Link>,
        children: [
          {
            key: "2-1-1",
            label: <Link href="/product">Product</Link>,
          },
          {
            key: "2-1-2",
            label: <Link href="/transaction">Transaction</Link>,
          },
        ],
      },
      {
        key: "2-2",
        label: <Link href="/transaction">Transaction</Link>,
        children: [
          {
            key: "2-2-1",
            label: <Link href="/product">Product</Link>,
          },
          {
            key: "2-2-2",
            label: <Link href="/transaction">Transaction</Link>,
          },
        ],
      },
    ],
  },
];
// handphone end

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

const Navbar = () => {
  const router = useRouter();
  // const { data }: any = useSession();
  const dispatch = useDispatch();
  const { isOpen, isOpenAccordion, isActiveMenu } = useSelector(
    (state: any) => state.navbarMobile
  );

  const pathname = usePathname();

  // handphone
  //  coba dengan redux
  // const [open, setOpen] = useState(isOpen);
  // const showDrawer = () => {
  //   dispatch(drawerOpen());
  // };
  // const onClose = () => {
  //   dispatch(drawerClose());
  // };
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
      dispatch(accordionActive(keys));
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      dispatch(accordionActive(latestOpenKey ? [latestOpenKey] : []));
    }
  };

  const itemsHandphone: MenuItem[] = [
    getItem("Navigation One", "sub1", <MailOutlined />, [
      getItem("Option 1", "1"),
      getItem("Option 2", "2"),
      getItem("Option 3", "3"),
      getItem("Option 4", "4"),
    ]),
    getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
    getItem("Navigation Three", "sub4", <SettingOutlined />, [
      getItem(
        <Link
          href="/product"
          className={pathname == "/product" ? "ant-menu-item-active" : ""}
        >
          Product
        </Link>,
        "9"
      ),
      getItem(
        <Link
          href="/transaction"
          className={pathname == "/transaction" ? "ant-menu-item-active" : ""}
          // style={
          //   pathname == "/transaction"
          //     ? { color: `#1677ff`, borderBottom: `2px solid #1677ff` }
          //     : {}
          // }
        >
          Transaction
        </Link>,
        "10"
      ),
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ];

  const onClickMobile: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    dispatch(menuActive([e.key]));
  };
  // handphone end

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbar__navLeft}>
          <div className={styles.navbar__logo}>
            logo
            {/* {data && data.user?.fullname} */}
          </div>
        </div>
        <div className={styles.navbar__navRight}>
          {/* laptop */}
          <ul className={styles.navbar__navRight__ul}>
            <li className={styles.navbar__navRight__ul__li}>
              <Dropdown menu={{ items }}>
                <Link
                  className={`${styles.navbar__navRight__ul__li__a}`}
                  href="/master/user"
                  style={
                    pathname == "/master/user"
                      ? { color: `#1677ff`, borderBottom: `2px solid #1677ff` }
                      : {}
                  }
                >
                  M. User
                </Link>
              </Dropdown>
            </li>
            <li className={styles.navbar__navRight__ul__li}>
              <Dropdown menu={{ items }}>
                <Link
                  className={`${styles.navbar__navRight__ul__li__a}`}
                  href="/master/product"
                  style={
                    pathname == "/master/product"
                      ? { color: `#1677ff`, borderBottom: `2px solid #1677ff` }
                      : {}
                  }
                >
                  M. Product
                </Link>
              </Dropdown>
            </li>
            <li className={styles.navbar__navRight__ul__li}>
              <Dropdown menu={{ items }}>
                <Link
                  className={`${styles.navbar__navRight__ul__li__a}`}
                  href="/master/redux"
                  style={
                    pathname == "/master/redux"
                      ? { color: `#1677ff`, borderBottom: `2px solid #1677ff` }
                      : {}
                  }
                >
                  M. Redux
                </Link>
              </Dropdown>
            </li>
            {/* <li className={styles.navbar__navRight__ul__li}>
              <Link
                className={styles.navbar__navRight__ul__li__a}
                href="/register"
              >
                Register
              </Link>
            </li> */}
            {/* {data ? (
              <li className={styles.navbar__navRight__ul__li}>
                <a
                  className={styles.navbar__navRight__ul__li__a}
                  onClick={() =>
                    signOut({ redirect: false }).then(() => {
                      router.push("/auth/login");
                    })
                  }
                >
                  Logout
                </a>
              </li>
            ) : (
              <li className={styles.navbar__navRight__ul__li}>
                <a
                  className={styles.navbar__navRight__ul__li__a}
                  onClick={() => signIn()}
                >
                  Login
                </a>
              </li>
            )} */}
          </ul>
          {/* laptop end */}

          {/* handphone */}
          <Button
            type="primary"
            onClick={showDrawer}
            className={styles.navbar__navRight__btnCollapse}
          >
            Open
          </Button>
          <Drawer
            onClose={onClose}
            open={open}
            className={styles.navbar__navRight__canvasCollapse}
          >
            <Menu
              mode="inline"
              // openKeys={openKeys}
              onClick={onClickMobile}
              selectedKeys={isActiveMenu}
              openKeys={isOpenAccordion}
              onOpenChange={onOpenChange}
              style={{ width: "100%" }}
              items={itemsHandphone}
            />
          </Drawer>
          {/* handphone end */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
